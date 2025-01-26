import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"

import { db } from '../lib/firebase'
import { collection, getDocs } from "firebase/firestore";
import StreamPost from '../components/StreamPost';




const HomePage = () => {
  const nav = useNavigate();

  const inputRef = useRef(null)

  const [streams, setStreams] = useState([])

  const streamList = streams.map((strm) => {
    return <li key={strm.id}>
      <StreamPost title={strm.title} thumbnail={strm?.thumbnail} views={strm.views} streamer_id={strm.userId} streamId={strm.id}></StreamPost>
    </li>
  })

  async function getData() {
    console.log('running')
    const querySnapshot = await getDocs(collection(db, "streams"));
    let streams_ret = []
    const snap = querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      streams_ret.push({
        id: doc.id,
        ...doc.data()
      })
    });
    setStreams(streams_ret)
  }

  useEffect(() => {

    getData()
    return () => { }
  }, [])

  return (
    <div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <input type="text" placeholder="Enter stream title..." className="input input-bordered w-full max-w-xs" ref={inputRef}/>
            <button className='btn btn-primary mx-2' onClick={() => nav(`/start-stream?streamTitle=${inputRef.current.value}`)}>Start</button>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
        </div>
      </dialog>
      <div>
        <ul className='grid grid-cols-4'>
          {streamList}
        </ul>
      </div>
      <button className="btn btn-primary fixed bottom-2 right-2" onClick={() => document.getElementById('my_modal_3').showModal()}>Start Stream</button>
    </div>
  )
}

export default HomePage