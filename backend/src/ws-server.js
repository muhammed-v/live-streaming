import fs from 'fs'
import path from 'path';
import { spawn } from 'child_process';
import { WebSocketServer } from 'ws'


// Set up WebSocket server
const wss = new WebSocketServer({ port: 3200 });
console.log('WebSocket server running on ws://localhost:3200');

const directory = "hls";

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});

// Create HLS output directory
const hlsDir = path.join(import.meta.dirname, 'hls');
if (!fs.existsSync(hlsDir)) fs.mkdirSync(hlsDir);

let ffmpeg;

// Handle WebSocket connections
wss.on('connection', (ws) => {
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
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});