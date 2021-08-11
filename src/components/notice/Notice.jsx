import './notice.css'
import { Button,CircularProgress } from '@material-ui/core'
import { EmojiPeopleRounded,Chat,AddPhotoAlternate,Favorite } from '@material-ui/icons';
import {format} from 'timeago.js'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';
export default function Notice({notices}) {
    const [allNotices,setAllNotices] = useState(notices)
    const user = JSON.parse(localStorage.getItem("user"))
    const [acceptLoading,setAcceptLoading] =useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page ,setPage] = useState(1)
    const history = useHistory();
    useEffect(() => {
        if(notices.length===0){
            setHasMore(false)
        }
    }, [notices])
    const handleLink = (notice)=>{
        //要發送更改read的API      
        //根據有沒有read過來決定會不會觸發
        const updateNotice = async()=>{
            console.log("test")
            const res = await axios.put('/api/notice/update/'+notice._id)
            console.log(res.data.data)
            if(notice.object === 'post' || notice.object==='friendRequest'|| notice.object==='friendAccepted'){
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
                // history.push({
                //     pathname:'/post/'+notice.postId
                // })
                window.location.href="/post/"+notice.postId
            }
        }
        updateNotice()     
    }
    const acceptFriendRequest = (e,notice)=>{
        e.stopPropagation();
        setAcceptLoading(true)
        console.log(notice)
        //加朋友 並且刪除提醒和pending
        const action = async()=>{
            const addFriend = await axios.put("/api/users/friend/"+notice.senderId)
            const deleteNotice = await axios.delete('/api/notice/delete/'+notice._id)
            const deletePending = await axios.delete('/api/users/pending/'+notice.senderId)
            const newNotice = {
                senderId : user._id,
                object : "friendAccepted",
                senderPic : user.profilePicture,
                senderUsername : user.username,
                receiverId: notice.senderId
            }
            const sendNotice = await axios.post('/api/notice',newNotice)
            //window.location.reload()
            // console.log(addFriend.data.data)
            // console.log(deleteNotice.data.data)
            // console.log(deletePending.data.data)
            // console.log(sendNotice.data.data)
            setAcceptLoading(false)
        }
        action()
        window.location.reload()
    }
    const fetchData = async()=>{
        console.log("trigger")
        const getNotification = async()=>{
            try{
                 const res = await axios('/api/notice/'+user._id+"/"+page)
                 console.log(res.data.data)
                 if(res.data.data.length===0){
                     setHasMore(false)
                 }
                 
                 setAllNotices (prevNotices=>{
                     return([...prevNotices,...res.data.data])
                 });
                 console.log(notices)
                 setPage(page+1)
                 console.log(page)
            }catch(err){
                console.log(err)
            }
        } 
        getNotification()
    }
    return (
        <div className="notice" id="scrollableDiv">
            <div className="noticeWrapper">
                <div className="noticeTop">
                    <h1>通知</h1>
                </div>
                <div className="noticeCenter" >
                                
                    <InfiniteScroll
                        className="feedScrollbar"
                        dataLength={allNotices.length} //This is important field to render the next data
                        next={fetchData}
                        hasMore={hasMore}
                        loader={<div className="onLoading"><CircularProgress  size="20px"/></div>}
                        endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b> "暫時沒有其他通知了！" </b>
                        </p>
                        }
                        scrollThreshold="95%"
                        scrollableTarget="scrollableDiv"
                    >
                    {allNotices && allNotices.map( (n) =>{
                        switch(n.object){
                            case 'friendAccepted':
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
                                return(
                                    <div className="noticeMessageFriend" key={n._id} onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
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
                                            <Button  style={{backgroundColor:"#1877F2",color:"white",marginRight:"20px"}} onClick={(e)=>acceptFriendRequest(e,n)}>
                                                {acceptLoading ? <CircularProgress color="white" size="20px"/> : "確認"}
                                            </Button>
                                            <Button  style={{backgroundColor:"#E4E6EB"}}>刪除</Button>
                                        </div>
                                    </div>
                                )
                            case 'message':
                                return(
                                    <div className="noticeMessage" key={n._id} onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
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
                                    <div className="noticeMessage" key={n._id} onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
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
                                    <div className="noticeMessage" key={n._id} onClick={()=>handleLink(n)} style={n.read.includes(user._id) ?{color:"gray"}:{}}>
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
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
}
