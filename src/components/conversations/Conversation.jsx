import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import "./conversation.css"
import axios from 'axios';
export default function Conversation({conversation, currentUser}) {
  const path = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const friendId = conversation.members.find(m=>m !== currentUser._id)

    const getUser = async ()=>{
      try {
        const res = await axios(`/users?userId=${friendId}`)
        setUser(res.data);
      }
      catch(error){
        console.log(error);
      }
    }
    getUser();
  },[currentUser, conversation])
  return (
    <div className='conversation'>
        <img src={user?.profilePicture ? user?.profilePicture : path + "person/noAvatar.png"} alt="" className="conversationImage" />
        <span className='conversationText'>{user?.username}</span>
    </div>
  )
}
