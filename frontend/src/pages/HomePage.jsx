import React from 'react'
import { useNavigate } from "react-router-dom"


const HomePage = () => {
  const nav = useNavigate()
  return (
    <div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <input type="text" placeholder="Enter stream title..." className="input input-bordered w-full max-w-xs" />
            <button className='btn btn-primary mx-2' onClick={() => nav('/start-stream')}>Start</button>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
        </div>
      </dialog>
      <button className="btn btn-primary fixed bottom-2 right-2" onClick={() => document.getElementById('my_modal_3').showModal()}>Start Stream</button>
    </div>
  )
}

export default HomePage