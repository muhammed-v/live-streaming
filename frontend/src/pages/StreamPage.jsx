import React, { useState, useRef, useEffect } from 'react'
import { CameraIcon } from 'lucide-react'

const HomePage = () => {

    const [mediaStream, setMediaStream] = useState(null)
    const [capturedImage, setCapturedImage] = useState(null);
    const [ws, setWs] = useState(null);

    const videoRef = useRef(null)

    useEffect(() => {
        const websocket = new WebSocket(`ws://127.0.0.1:${import.meta.env.VITE_WEBSOCKET_PORT}`);


        websocket.onopen = () => {
            console.log('WebSocket is connected');
            // Generate a unique client ID
            const id = Math.floor(Math.random() * 1000);
            // setClientId(id);
        };

        websocket.onclose = () => {
            console.log('WebSocket is closed');
        };

        setWs(websocket)
        return () => {
            websocket.close()
        }

    }, [])


    async function startCam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setMediaStream(stream);
        } catch (error) {
            console.error("Error accessing webcam", error);
        }
    }
    const stopWebcam = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
                track.stop();
            });
            setMediaStream(null);
        }
    };


    async function startStream() {
        if (mediaStream) {
            console.log('Stream started')
            const mediaRecorder = new MediaRecorder(mediaStream, {mimeType: 'video/webm'});

            mediaRecorder.ondataavailable = (ev) => {
                // stream the event
                if (ev.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                    ws.send(ev.data)
                }
            }

            mediaRecorder.start(500); // every 500ms
        }
    }

    return (
        <div className='p-4 flex flex-col gap-2'>
            <div className='flex'>
                <button className='btn btn-ghost p-2' onClick={() => { if (mediaStream) { stopWebcam() } else { startCam() } }}>
                    {mediaStream ? 'Cancel' : <CameraIcon className='h-5 w-5 text-base-content/40'></CameraIcon>}
                </button>
                <button className='btn btn-primary' onClick={startStream}>Start</button>
                
            <video ref={videoRef} autoPlay className='rounded'></video>
            </div>
        </div >
    )
}

export default HomePage