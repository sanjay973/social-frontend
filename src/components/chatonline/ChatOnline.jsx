import axios from "axios";
import { useState,  useEffect } from "react"
import "./chatOnline.css"
export default function ChatOnline({onlineUsers, currentId, setCurrentChat}) {
    const [friends, setFriends] = useState([]);
    const[onlineFriends, setOnlineFriends] = useState([]);
    useEffect(()=>{
        const getFriends = async() =>{
            const res = await axios.get(`/users/friends/${currentId}`);
            setFriends(res.data);
        }
        getFriends();
    },[currentId])


    useEffect(()=>{
        setOnlineFriends(friends.filter(f=>onlineUsers.includes(f._id)));
    },[friends, onlineUsers])

    const handleClick = async (user)=>{
        try{

        }catch(err){
            console.log(err)
        }
    }
  return (
    <div className="chatOnline">
        {onlineFriends.map(online=>{
         return   <>
            <div className="chatOnlineFriend" onClick={handleClick}>
            <div className="chatOnlineImageContainer">
                <img className="chatOnlineImage" src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80" alt="" />
                <div className="chatOnlineBadge"></div>
                <span className="chatOnlineUsername">{online?.username}</span>
            </div>
        </div>
        </>
        })}
    </div>
  )
}
