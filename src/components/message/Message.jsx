import React from 'react'
import "./message.css"
import {format} from 'timeago.js'
export default function Message({message, own}) {
  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img className="messageImage" src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80" alt="" />
            <p className='messageText'>{message.text}</p>
        </div>
        <div className="messageBottom">
            {/* {format(message?.createdAt)} */}
        </div>
    </div>
  )
}
