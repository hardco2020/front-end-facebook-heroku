
import './rightbar.css'
import Online from '../online/Online'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Add, Remove } from '@material-ui/icons'
import { useRef } from 'react'
import {io} from 'socket.io-client'

export default function Rightbar({user}) {
    
    //let history = useHistory()
    const [friends,setFriends] = useState([])
    const currentUser = JSON.parse(localStorage.getItem("user"))  
    //console.log(currentUser)
    //const {dispatch,user:contextuser} = useContext(AuthContext)
    //此處是使用localstorage去做確認 等於說如果做更新了 要直接去修改裡面的資料
    const [followed,setFollowed] = useState(currentUser.followings.includes(user?._id))
    const [onlineUsers,setOnlineUsers] = useState([]);
    const socket = useRef();

    useEffect(()=>{
        socket.current = io(process.env.REACT_APP_SOCKET_PORT) //此處要替換成測試andq上線port 
        socket.current.emit("addUser",currentUser._id)
        socket.current.on("getUsers",users=>{
            setOnlineUsers(
                currentUser.followings.filter((f)=> users.some((u)=>u.userId===f))
            );
        })
    },[])
    useEffect(()=>{
       setFollowed(currentUser.followings.includes(user?._id))
    },[currentUser,user?._id])
    useEffect(()=>{
        //console.log(user?._id)
        if(user){
            const getFriends = async()=>{
                try{
                    if(user?._id){
                        const friendList = await axios.get('/api/users/friends/'+ user?._id)
                        setFriends(friendList.data.data)
                    }
                }catch(err){
                    console.log(err)
                }
            };
            getFriends();
        }
    },[user?._id])


    const handleClick = async()=>{
        try{
            if(followed){
                await axios.put("api/users/"+user._id+"/unfollow",null);
                currentUser.followings = currentUser.followings.filter(follow=>follow!==user._id) 
                console.log(currentUser)
                localStorage.setItem("user",JSON.stringify(currentUser))
            }else{
                await axios.put("api/users/"+user._id+"/follow",null)
                currentUser.followings = [...currentUser.followings,user._id]
                console.log(currentUser)
                localStorage.setItem("user",JSON.stringify(currentUser))
            }
        }catch(err){
            console.log(err)
        }
        setFollowed(!followed)
    } 

    const HomeRightbar = ()=>{
        return(
            <>
                <div className="birthdayContainer">
                    <img className="birthdayImg" src="assets/gift3.png" alt="" />
                    <span className="birthdayText">
                        <b>游旻昌</b> and 和<b>其他三個人</b>今天生日
                    </span>
                </div>
                <img src="assets/add.jpg" alt="" className="rightbarAd" />
                <h4 className="rightbarTitle">正在線上的好友</h4>
                <ul className="rightbarFirendList">
                    {onlineUsers.map(u=>(
                        <Online key={u} user={u}/>
                    ))}
                </ul>    
            </>
        )
    }
    const ProfileRightbar = () =>{
        return(
            <>
                {/* 追蹤與否 */}
                {user.username !== currentUser.username &&(
                    <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ?  <Remove/> : <Add/>}
                    </button>

                )}
                <h4 className="rightbarTitle">用戶資訊</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">城市:</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">國家:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">感情狀態:</span>
                        <span className="rightbarInfoValue">{user.relationship===1? "單身" : user.relationship===2 ? "甜蜜交往中":"-"}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">他的朋友</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend)=>(
                    //讓此處Refresh
                    <div onClick={() => {window.location.href="/profile/"+friend.username}} key={friend._id}>
                    {/* <Link to={"/profile/"+friend.username} style={{textDecoration:"none"}} key={friend.username}  > */}
                    <div className="rightbarFollowing">
                        <img 
                            src={
                            friend.profilePicture 
                            ? friend.profilePicture 
                            : "https://i.imgur.com/HeIi0wU.png"} 
                            alt="" 
                            className="rightbarFollowingImg" 
                        />
                        <span className="rightbarFollowingName">{friend.username}</span>
                    </div>
                    {/* </Link> */}
                    </div>
                    ))}

                </div>
            </>
        )
    }
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar/> : <HomeRightbar/> }  
            </div>
        </div>
    )
}
