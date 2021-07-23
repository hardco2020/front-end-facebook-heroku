import './profile.css'
import Topbar from "../../components/topbar/Topbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Feed from "../../components/feed/Feed"
import Rightbar from "../../components/rightbar/Rightbar"
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useParams} from 'react-router'
export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [user,setUser] = useState({});
    const username = useParams().username;
    //console.log(username)
    useEffect(()=>{
        //這邊要用jwt token去呼叫
        //先隨機給一個 因為還沒拉好認證系統
        const fetchUser = async ()=>{
            const res = await axios.get(
                `/api/users?username=${username}`,
            );
            //console.log(res.data.data)
            setUser(res.data.data)
        };
        fetchUser();
    },[username]) //只render一次
    return (
        <>
        <Topbar/>
        <div className="profile">
            <Sidebar/>
            <div className="profileRight">
                <div className="profileRightTop">
                    <div className="profileCover">
                        <img src={ user.coverPicture ? PF+user.coverPicture : "https://i.imgur.com/kM5r80s.jpg"}
                             alt="" 
                             className="profileCoverImg" 
                        />
                        <img src={ user.profilePicture? PF+user.profilePicture :"https://i.imgur.com/HeIi0wU.png"}
                             alt="" 
                             className="profileUserImg" 
                        />
                    </div>
                    <div className="profileInfo">
                        <h4 className="profileInfoName">{user.username}</h4>
                        <span className="profileInfoDesc">{user.desc}</span>
                    </div>
                </div>
                <div className="profileRightBottom">
                    <Feed username={username}/>
                    <Rightbar user={user}/> 
                </div>
            </div>     
        </div>
        
        </>
    )
}
