import React, { useState } from 'react'
import ChatOnline from '../../components/chatonline/ChatOnline'
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import Topbar from '../../components/topbar/Topbar'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import "./messanger.css"
import { useEffect } from 'react'
import axios from 'axios'
import { useRef } from 'react'
import { io } from 'socket.io-client'
export default function Messanger() {
    const[conversations, setConversations] = useState([]);
    const[currentChat, setCurrentChat] = useState(null);
    const[messages, setMessages] = useState(null);
    const[newMessage, setNewMessage] = useState(null); 
    const[arrivalMessage, setArrivalMessage] = useState(null);
    const {user} = useContext(AuthContext);
    const[onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();

    useEffect(()=>{
        socket.current = io("https://social-socket-io.herokuapp.com/");
        socket.current.on("getMessage", data=>{
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now()
          })
        })
    },[])

    useEffect(()=>{
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev)=>[...prev, arrivalMessage]);
    },[arrivalMessage, currentChat])

    useEffect(()=>{
        socket.current.emit("addUser",(user._id));
        socket.current.on("getUsers",(users)=>{
            setOnlineUsers(user?.followings.filter(f=>users.filter(u=>u.userId === f)));
        })
    },[user]);

    useEffect(()=>{
        const getConversations = async()=>{
            try{
                const res = await axios.get(`/conversations/${user._id}`);
                setConversations(res.data);
            }
            catch(error) {
                console.log(error);
            }
        }
        getConversations();
    },[user._id])
    
    useEffect(()=>{
        const getMessages = async ()=>{
            try{
                const res = await axios.get(`/messages/${currentChat?._id}`)
                setMessages(res.data);
            }catch(error){
                console.log(error);
            }
        }
        getMessages();
    },[currentChat])

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage, 
            conversationId: currentChat._id
        }
        const receiverId = currentChat.members.find(member=> member !== user._id);
        socket.current.emit("sendMessage",{
            senderId: user._id,
            receiverId,
            text: newMessage
        })
        try{
            const  res = await axios.post(`/messages`, message);
            setMessages([...messages, res.data])
            setNewMessage("");
        }catch(error){
            console.log(error)
        }

    }
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: "smooth"}) 
    }, [messages])
  return (
    <>
    <Topbar/>
    <div className="messanger">
        <div className="chatMenu">
            <div className="chatMenuWrapper">
                <input placeholder='Search for friends' className='chatMenuInput' />
                {
                    conversations.map((conv)=>{
                       return <>
                       <div onClick={()=>setCurrentChat(conv)}>
                       <Conversation key={conv._id} conversation={conv} currentUser = {user}/>
                       </div>
                       </>
                    })
                }
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">
            {
                currentChat ? 
                <>
                <div className="chatBoxTop">
                    {
                        messages.map((message)=>{
                            return <> 
                            <div ref={scrollRef}>
                            <Message message={message} own = {message.sender === user?._id}/>
                            </div>
                            </>
                        })
                    }
                </div>
                <div className="chatBoxBottom">
                    <textarea onChange={(e)=>setNewMessage(e.target.value)} placeholder='type a message' className='chatMessageInput' value={newMessage} ></textarea>
                    <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                </div>
            </> : <span className='noConversationText'>Start A Chat</span>
            }
            </div>
        </div>
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
                <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat}/>
            </div>
        </div>
    </div>
    </>
  )
}
