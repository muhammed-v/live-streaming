import React, { useState, useRef, useEffect } from 'react'
import { CameraIcon } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { doc, addDoc } from 'firebase/firestore'
import {db} from '../lib/firebase.js'
import { collection } from 'firebase/firestore';

import Cookies from 'js-cookie'
import { useAuthStore } from '../store/useAuthStore.js'



const HomePage = () => {

    const [mediaStream, setMediaStream] = useState(null)
    const [capturedImage, setCapturedImage] = useState(null);
    const [ws, setWs] = useState(null);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const streamTitle = searchParams.get("streamTitle")

    const { authUser } = useAuthStore()
    
    
    const videoRef = useRef(null)
    
    useEffect(() => {
        
        const websocket = new WebSocket(`ws://127.0.0.1:${import.meta.env.VITE_WEBSOCKET_PORT}/?token=${Cookies.get('jwt')}`);


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


            // db write
            const streamRef = await addDoc(collection(db, "streams"), {
                title: streamTitle,
                views: 0,
                userId: authUser._id
            })
            console.log(streamRef)
            console.log('stream written')
            mediaRecorder.ondataavailable = (ev) => {
                // stream the event
                if (ev.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                    ws.send(ev.data)
                }
            }

            mediaRecorder.start(500); // every 500ms send chunk

        }
    }

    return (
        <div className='p-4 flex flex-col gap-2'>
            <h1 className='text-xl'>{streamTitle}</h1>
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