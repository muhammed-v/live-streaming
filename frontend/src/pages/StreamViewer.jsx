import { data, useParams } from "react-router-dom"
import { useEffect,useState, useRef } from "react";
import ReactHlsPlayer from "react-hls-player"
import { getDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

import Cookies from 'js-cookie'

export default function StreamViewer() {

    const { stream_id } = useParams();
    const [maxLoadingDelay,setMaxLoadingDelay] = useState(0);
    const [minAutoBitrate,setMinAutoBitrate] = useState(0);
    const [lowLatencyMode,setlowLatencyMode] = useState(true);

    const [streamData, setStreamData] = useState(null)

    async function loadStreamData() {
        const docSnap = await getDoc(doc(db, "streams", stream_id))
        if (docSnap.exists()) {
            setStreamData(docSnap.data())
        }
    }

    useEffect(() => {
        loadStreamData()

    }, [])



    return (
        <div>
            <h1>{stream_id}</h1>
            <input className="input input-bordered input-primary w-20 m-2" type="number" name="MaxLoadingDelay" value={maxLoadingDelay} min="1" max="5" onChange={e => setMaxLoadingDelay(e.target.value)}></input>
            <input className="input input-bordered input-primary w-20 m-2" type="number" name="MinAudioBitrate" value={minAutoBitrate} min="1" max="5" onChange={e => setMinAutoBitrate(e.target.value)}></input>
            <input type="checkbox" className="toggle " defaultChecked onChange={(e) => setlowLatencyMode(e.target.checked)} />
            {streamData ? <ReactHlsPlayer
                src={`http://127.0.0.1:3200/hls/hls_${streamData.userId}/playlist.m3u8`}
                autoPlay={true}
                controls={true}
                width="100%"
                height="auto"
                hlsConfig={{
                    maxLoadingDelay:maxLoadingDelay,
                    minAutoBitrate:minAutoBitrate,
                    lowLatencyMode: lowLatencyMode,
                }}
            /> : ''}
        </div>
    )
}