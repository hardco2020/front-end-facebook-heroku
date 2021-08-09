import './chatOnline.css'
import axios from 'axios'
import { useState,useEffect } from 'react';
export default function ChatOnline({onlineUsers , currentId, setCurrentChat,switchChat}) {
    const [friends,setFriends] = useState([]);
    const [onlineFriends,setOnlineFriends] = useState([]);

    useEffect(()=>{
        const getFriends = async ()=>{
            const res = await axios.get("/api/users/friends/"+currentId)
            setFriends(res.data.data)
        }
        getFriends();
    },[currentId])
    
    useEffect(()=>{
        setOnlineFriends(friends.filter(f=>onlineUsers.includes(f._id)))
    },[friends,onlineUsers])

    const handleClick = async(user)=>{
        try{
            let res = await axios.get(`/api/conversations/find/${currentId}/${user._id}`);
            //不存在聊天室 建立一個
            if (res.data.data==null){
                console.log("沒有聊天室")
                const data  = {
                    senderId:user._id,
                    receiverId:currentId
                }
                res = await axios.post("/api/conversations/",data)
            }
            switchChat(res.data.data)
        }catch(err){
            console.log(err)
        }
    }
    return (
        <div className="chatOnline">
            {friends.map( (o) =>(
            <div className="chatOnlineFriend" key={o._id} onClick={()=>handleClick(o) }>
                <div className="chatOnlineImgContainer">
                    <img 
                        className="chatOnlineImg"
                        src={ o.profilePicture!=="" 
                            ? o.profilePicture 
                            :"https://i.imgur.com/HeIi0wU.png"
                        }
                        alt="" 
                    />
                    {onlineUsers.includes(o._id) &&<div className="chatOnlineBadge"></div>}
                </div>
                <span className="chatOnlineName">{o.username}</span>
            </div> 
            ))}
        </div>
    )
}
