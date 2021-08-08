import './notice.css'
import { Button } from '@material-ui/core'
import { EmojiPeopleRounded,Chat,AddPhotoAlternate,Favorite } from '@material-ui/icons';
import {format} from 'timeago.js'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
export default function Notice({notices}) {
    const user = JSON.parse(localStorage.getItem("user"))
    const history = useHistory();
    console.log(notices)
    const handleLink = (notice)=>{
        //要發送更改read的API      
        //根據有沒有read過來決定會不會觸發
        const updateNotice = async()=>{
            console.log("test")
            const res = await axios.put('/api/notice/update/'+notice._id)
            console.log(res.data.data)
            if(notice.object === 'post'){
                window.location.href="/profile/"+notice.senderUsername
            }
            else if(notice.object ==='message'){
                let res = await axios.get(`/api/conversations/find/${notice.senderId}/${notice.receiverId[0]}`);
                history.push({
                    pathname: '/messenger',
                    state: { chat: res.data.data }
                })
            }
            else if(notice.object ==='comment' || notice.object ==='like'){
                history.push({
                    pathname:'/post/'+notice.postId
                })
            }
        }
        updateNotice()     
    }
    return (
        <div className="notice">
            <div className="noticeWrapper">
                <div className="noticeTop">
                    <h1>通知</h1>
                </div>
                <div className="noticeCenter" >
                    {notices && notices.map( (n) =>{
                        switch(n.object){
                            case 'friendAccepted':
                                console.log("朋友接受")
                                return(
                                    <div className="noticeMessage" key={n._id} onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
                                        <div className="noticeMessageCotentLeft">
                                            <img src={n.senderPic!=="" ? n.senderPic : "https://i.imgur.com/HeIi0wU.png"} alt="" className="noticeImg" />
                                            <EmojiPeopleRounded  htmlColor="white" className="noticeTypeImgFriend" />
                                        </div>
                                        <div className="noticeMessageCotentRight">
                                            <span><b>{n.senderUsername}</b>和你成為了朋友</span>
                                            <span className="noticeTimestamp">{format(n.createdAt)}</span>
                                        </div>
                                    </div>
                                )
                            case 'post':
                                console.log("貼文")
                                return(
                                    <div className="noticeMessage" key={n._id} onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
                                        <div className="noticeMessageCotentLeft">
                                            <img src={n.senderPic!=="" ? n.senderPic : "https://i.imgur.com/HeIi0wU.png"} alt="" className="noticeImg" />
                                            <AddPhotoAlternate  htmlColor="white" className="noticeTypeImgPost"/>
                                        </div>
                                        <div className="noticeMessageCotentRight">
                                            <span><b>{n.senderUsername}</b>發布了一則近況更新 </span>
                                            <span className="noticeTimestamp">{format(n.createdAt)}</span>
                                        </div>
                                    </div>
                                )
                            case 'friendRequest':
                                console.log("朋友邀請")
                                return(
                                    <div className="noticeMessageFriend" onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
                                        <div className ="noticeMessageFriendContent">
                                            <div className="noticeMessageCotentLeft">
                                                <img src={n.senderPic!=="" ? n.senderPic : "https://i.imgur.com/HeIi0wU.png"} alt="" className="noticeImg" />
                                                <EmojiPeopleRounded  htmlColor="white" className="noticeTypeImgFriend"/>
                                            </div>
                                            <div className="noticeMessageCotentRight">
                                                <span><b>{n.senderUsername}</b>發送了一個朋友邀請給你喔</span>
                                                <span className="noticeTimestamp">{format(n.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className= "noticeMessageFriendRequest">
                                            <Button  style={{backgroundColor:"#1877F2",color:"white",marginRight:"20px"}}>確認</Button>
                                            <Button  style={{backgroundColor:"#E4E6EB"}}>刪除</Button>
                                        </div>
                                    </div>
                                )
                            case 'message':
                                console.log("訊息")
                                return(
                                    <div className="noticeMessage" onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
                                        <div className="noticeMessageCotentLeft">
                                            <img src={n.senderPic!=="" ? n.senderPic : "https://i.imgur.com/HeIi0wU.png"} alt="" className="noticeImg" />
                                            <Chat htmlColor="white" className="noticeTypeImgMessage"/>
                                        </div>
                                        <div className="noticeMessageCotentRight">
                                            <span><b>{n.senderUsername}</b>傳送了訊息給你</span>
                                            <span className="noticeTimestamp">{format(n.createdAt)}</span>
                                        </div>
                                        
                                    </div>
                                )
                            case 'comment':
                                return(
                                    <div className="noticeMessage" onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
                                        <div className="noticeMessageCotentLeft">
                                            <img src={n.senderPic!=="" ? n.senderPic : "https://i.imgur.com/HeIi0wU.png"} alt="" className="noticeImg" />
                                            <Chat  htmlColor="white" className="noticeTypeImgPost"/>
                                        </div>
                                        <div className="noticeMessageCotentRight">
                                            <span><b>{n.senderUsername}</b>在你的貼文底下留言</span>
                                            <span className="noticeTimestamp">{format(n.createdAt)}</span>
                                        </div>
                                        
                                    </div>
                                )
                            case 'like':
                                return(
                                    <div className="noticeMessage" onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
                                        <div className="noticeMessageCotentLeft">
                                            <img src={n.senderPic!=="" ? n.senderPic : "https://i.imgur.com/HeIi0wU.png"} alt="" className="noticeImg" />
                                            <Favorite  htmlColor="white" className="noticeTypeImgLike"/>
                                        </div>
                                        <div className="noticeMessageCotentRight">
                                            <span><b>{n.senderUsername}</b>按讚了你的貼文</span>
                                            <span className="noticeTimestamp">{format(n.createdAt)}</span>
                                        </div>
                                        
                                    </div>
                                )
                            default:
                                return(
                                    <div className="noticeMessage">
                                        <div className="noticeMessageCotentLeft">
                                            <img src={n.senderPic!=="" ? n.senderPic : "https://i.imgur.com/HeIi0wU.png"} alt="" className="noticeImg" />
                                            <Chat  htmlColor="white" className="noticeTypeImgMessage"/>
                                        </div>
                                        <div className="noticeMessageCotentRight">
                                            <span><b>{n.senderUsername}</b>在你的貼文底下留言</span>
                                            <span className="noticeTimestamp">{format(n.createdAt)}</span>
                                        </div>
                                        
                                    </div>
                                )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
