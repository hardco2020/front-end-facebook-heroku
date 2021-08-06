import './chatOnline.css'
import axios from 'axios'
import { useState,useEffect } from 'react';
export default function ChatOnline({onlineUsers , currentId, setCurrentChat}) {
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
            const res = await axios.get(`/api/conversations/find/${currentId}/${user._id}`);
            setCurrentChat(res.data.dat)
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
