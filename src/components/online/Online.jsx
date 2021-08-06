import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom";
import "./online.css"

export default function Online({user}) {
    const [friend,setFriend] = useState(null);
    useEffect(()=>{
        console.log(user)
        const getUser = async()=>{
            const res = await axios.get(`/api/users/?userId=${user}`)
            setFriend(res.data.data)
        }
        getUser();
    },[])
    return ( 
        <Link to={friend && "/profile/"+friend.username} style={{textDecoration:"none",color: "inherit"}} >
        <li className="rightbarFriend">
                    <div className="rightbarProfileImgContainer">
                        <img src={friend && friend.profilePicture!==""  ? friend.profilePicture :"https://i.imgur.com/HeIi0wU.png"}alt="" className="rightbarProfileImg" />
                        <span className="rightbarOnline"></span>
                    </div>
                    <span className="rightbarUsername">{friend? friend.username :"" }</span>
        </li>
        </Link>
    )
}
