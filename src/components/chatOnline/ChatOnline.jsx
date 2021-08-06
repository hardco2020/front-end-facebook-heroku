import './chatOnline.css'
import axios from 'axios'
import { useState,useEffect } from 'react';
export default function ChatOnline({onlineUsers , currentId, setCurrentChat,switchChat}) {
    const [friends,setFriends] = useState([]);
    const [onlineFriends,setOnlineFriends] = useState([]);

    useEffect(()=>{
        console.log("test")
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
            console.log(res.data.data)
            switchChat(res.data.data)
        }catch(err){
            console.log(err)
        }
    }
    return (
        <div className="chatOnline">
            {onlineFriends.map( (o) =>(
            <div className="chatOnlineFriend" key={o._id} onClick={()=>handleClick(o) }>
                <div className="chatOnlineImgContainer">
                    <img 
                        className="chatOnlineImg"
                        src={ o.profilePicture!=="" 
                            ? o.profilePicture 
                            :"https://imgur.com/P68DSf9.jpg"
                        }
                        alt="" 
                    />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">{o.username}</span>
            </div> 
            ))}
        </div>
    )
}
