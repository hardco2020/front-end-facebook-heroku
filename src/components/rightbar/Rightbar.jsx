
import './rightbar.css'
import Online from '../online/Online'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button,CircularProgress} from '@material-ui/core'
import { PersonAdd,PersonAddDisabled,RecordVoiceOver} from '@material-ui/icons'
import { useRef } from 'react'
import {io} from 'socket.io-client'

export default function Rightbar({user}) {
    
    //let history = useHistory()
    const [friends,setFriends] = useState([])
    const currentUser = JSON.parse(localStorage.getItem("user"))  
    //console.log(currentUser)
    //const {dispatch,user:contextuser} = useContext(AuthContext)
    //此處是使用localstorage去做確認 等於說如果做更新了 要直接去修改裡面的資料
    const [followed,setFollowed] = useState(currentUser.friends.includes(user?._id))
    const [state,setState] = useState("")
    const [stateIcon,setStateIcon] = useState("")
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const socket = useRef();
    useEffect(()=>{
        if(user){
            //狀態有三種 加入好友=> not friends && no pending 
            // 邀請中 pending && no friends 
            // 將pending改成雙向的？
            const checkFriendAndPending = async()=>{
                const resFriend = await axios.get("/api/users/friends/"+user._id)
                const resPending = await axios.get("/api/users/pending/"+user._id)
                const userFriends = resFriend.data.data
                const isFriend = userFriends.find(friend=>{
                   return friend._id === currentUser._id
                })
                if(!isFriend && resPending.data.data===null ){
                    setState("加朋友")
                    setStateIcon(<PersonAdd/>)
                }
                if(isFriend){
                    setState("取消朋友")
                    setStateIcon(<PersonAddDisabled/>)
                }
                if(!isFriend && resPending.data.data!==null){
                    setState("邀請中")
                    setStateIcon(<RecordVoiceOver/>)
                }
            }
            checkFriendAndPending()
        }
    },[user?._id])
    useEffect(()=>{
        socket.current = io(process.env.REACT_APP_SOCKET_PORT) //此處要替換成測試andq上線port 
        socket.current.emit("addUser",currentUser._id)
        socket.current.on("getUsers",users=>{
            setOnlineUsers(
                currentUser.friends.filter((f)=> users.some((u)=>u.userId===f))
            );
        })
    },[])
    useEffect(()=>{
       setFollowed(currentUser.friends.includes(user?._id))
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
                setIsLoading(true)
                await axios.put("api/users/unfriend/"+user._id,null);
                currentUser.friends = currentUser.friends.filter(friend=>friend!==user._id) 
                console.log(currentUser)
                localStorage.setItem("user",JSON.stringify(currentUser))
            }else{
                setIsLoading(true)
                //發出朋友邀請 要發出pending的審核
                const sendPending = async()=>{
                    await axios.post('/api/users/pending/'+user._id)
                }
                const  sendNotice = async ()=>{
                    const notice = {
                        senderId : currentUser._id,
                        object : "friendRequest",
                        senderPic : currentUser.profilePicture,
                        senderUsername : currentUser.username,
                        receiverId: user._id
                    }
                    await axios.post('/api/notice',notice)
                    window.location.reload()
                }
                await sendPending()
                await sendNotice()
                // await axios.put("api/users/friend/"+user._id,null)
                // currentUser.friends = [...currentUser.friends,user._id]
                // console.log(currentUser)
                // localStorage.setItem("user",JSON.stringify(currentUser))
            }
        }catch(err){
            console.log(err)
        }
        setIsLoading(false)
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
                    <Button 
                        onClick={handleClick} 
                        startIcon={isLoading? "" : stateIcon}
                        style={{marginBottom:"10px",marginTop:"30px",fontSize:"16px",backgroundColor:"#007355",color:"white",alignItems:"center",padding:"8px 12px"}}
                        disabled={isLoading || state==="邀請中"}
                    >
                        {isLoading 
                                ?  <CircularProgress color="white" size="20px"/>
                                : state
                        }
                    </Button>

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
