import {EyeIcon} from 'lucide-react'
import React from 'react'

export default function StreamPost({
    title, thumbnail, streamer_id, views, streamId
}) {
    return (
        <a href={`/streams/${streamId}`}>
            <div className="card bg-base-100 w-96 shadow-xl">
            <figure>
                <img
                    src={thumbnail ? thumbnail : "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {title}
                    <div className="badge badge-secondary">Live</div>
                </h2>
                <p>
                    <EyeIcon className='size-5'></EyeIcon> {views}
                </p>
                <div className="card-actions justify-end">
                    <div className="badge badge-outline">{streamer_id}</div>
                </div>
            </div>
        </div>
        </a>
    )
}
