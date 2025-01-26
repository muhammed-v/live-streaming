import fs from 'fs'
import path from 'path';
import { spawn } from 'child_process';
import { WebSocketServer } from 'ws';
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { parse, URL, format } from 'url'
import cookieParser from 'cookie-parser';

const HLS_PORT = 3200

const app = express()

app.use(cors({
    origin: ['http://localhost:5173'],
}))

// app.use(cookieParser())


function protect_path(req, res, next) {
    try {
        const token= req.cookies.jwt; // jwt is used since we named our token as jwt while creating ... To grab token from cookies, we use cookie parser package

        if(!token){//if no token provided
            return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }
        const decoded= jwt.verify(token,'mysecretkey') // we used private key JWT_SECRET to create the token, therefore for decoding also, we use the same key.

        if (!decoded){ // if decoded value is false
            return res.status(401).json({message: "Unauthorized - Invalid Token", data: req.cookies});
        }

          next()

    } catch (error) {
        console.log("Error in protectRoute middleware: ",error.message);
        res.status(500).json({message:"Internal Server Error gau"});
    }
}

app.use('/',  express.static(path.join(import.meta.dirname, 'dist copy')))

app.use('/hls', express.static(path.join(import.meta.dirname, 'hls')))


const server = app.listen(HLS_PORT, () => {
    console.log(import.meta.dirname)
    console.log('HLS Server start')
})

function authenticate(request) {
    const { token } = parse(request.url, true).query  //request.cookies.jwt??
    // TODO: Actually authenticate token
    console.log('Authenticating...')
    const decoded = jwt.verify(token, 'mysecretkey')
    console.log(decoded)
    if (decoded) {
        return {
            auth: true,
            userId: decoded.userId
        }
    }
}

const wss = new WebSocketServer({noServer: true});

server.on('upgrade', (request, socket, head) => {
    console.log('here')
    const {auth, userId} = authenticate(request)

    if (!auth) {
        // \r\n\r\n: These are control characters used in HTTP to
        // denote the end of the HTTP headers section.
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return 
    }

    request.authData = userId;

    wss.handleUpgrade(request, socket, head, connection => {
        // Manually emit the 'connection' event on a WebSocket 
        // server (we subscribe to this event below).
        wss.emit('connection', connection, request)
    })
})


// Set up WebSocket server



// Create HLS output directory


function handleNewStreamConnection(ws, req) {
    // console.log(req)
    const userId = req.authData
    console.log(userId)

    const hlsDir = path.join(import.meta.dirname, `hls/hls_${userId}`);
    if (!fs.existsSync(hlsDir)) fs.mkdirSync(hlsDir);
    let ffmpeg;
    console.log('Client connected');


    ffmpeg = spawn('ffmpeg', [
        '-i', 'pipe:0',                // Input from pipe (WebSocket chunks)
        '-c:v', 'libx264',            // Video codec
        '-preset', 'ultrafast',   
        '-b:v', '1M',     // Encoding preset
        '-g', '60',                   // Keyframe interval
        '-tune', 'zerolatency',
        '-hls_time', '4',             // Segment duration
        '-hls_list_size', '5',        // Playlist size
        '-hls_flags', 'delete_segments',
        '-hls_segment_filename', path.join(hlsDir, 'segment_%03d.ts'), // Segment files
        path.join(hlsDir, 'playlist.m3u8') // Output HLS playlist
    ]);

    

    ffmpeg.stderr.on('data', (data) => {
        console.error(`FFmpeg error: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`FFmpeg exited with code ${code}`);
    });

    // Handle incoming video chunks
    ws.on('message', (chunk) => {
        if (ffmpeg.stdin.writable) {
            ffmpeg.stdin.write(chunk);
            console.log('Video chunk received and piped to FFmpeg');
        }
    });

    // Handle WebSocket disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        if (ffmpeg.stdin.writable) {
            ffmpeg.stdin.end();
        }
        fs.readdir(hlsDir, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(hlsDir, file), (err) => {
                if (err) throw err;
              });
            }
          });
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
}


// Handle WebSocket connections
wss.on('connection', (ws, req) => {
    handleNewStreamConnection(ws, req);
});