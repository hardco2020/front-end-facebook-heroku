import "./post.css"
import { MoreVert,ThumbUpOutlined,ChatBubbleOutline,Share} from "@material-ui/icons"
import { useState,useEffect} from "react"
import axios from "axios"
import {format} from 'timeago.js'
import { Link } from "react-router-dom"
//export default function Post({post}) {
const Post = (({post})=> {
    const [user,setUser] = useState({});
    const [like,setLike] = useState(post.likes.length)
    const [isLiked,setIsLiked] = useState(false)
    const [currentComment,setCurrentComment] = useState([])
    const currentUser = JSON.parse(localStorage.getItem("user"))
    const [hideComment,setHideComment] = useState('none');
    //const {user:currentUser} = useContext(AuthContext)
    //console.log(token)
    //到時候透過jwt來傳遞

    useEffect(()=>{   
        setIsLiked(post.likes.includes(currentUser._id))
    },[currentUser._id,post.likes])
    
    useEffect(()=>{
        // const config = {
        //     headers: { Authorization:"Bearer "+token}
        // };
        //這邊要用jwt token去呼叫
        //先隨機給一個 因為還沒拉好認證系統
        const fetchUser = async ()=>{
            const res = await axios.get(
                `/api/users?userId=${post.userId}`,
                // config
            )
            //console.log(res.data)
            setUser(res.data.data)
        };
        fetchUser();
    },[post.userId]) //只render一次

    const sendComment = async(event)=>{
        if(event.key === 'Enter'){
            //執行API送出
            const datenow = new Date()
            const commentData = {
                userName : currentUser.username,
                userPic : currentUser.profilePicture,
                comment : event.target.value,
                date: datenow            
            }
            const sendComment = await axios.post('api/posts/comment/'+post._id,commentData)
            setCurrentComment(sendComment.data.data.comment)       
            post.comment = currentComment
            event.target.value = ""
            setHideComment('')
            //如果是自己留言不能發通知
            if(currentUser._id !== post.userId){
                const  sendNotice = async ()=>{
                    const notice = {
                        senderId : currentUser._id,
                        object : "comment",
                        senderPic : currentUser.profilePicture,
                        senderUsername : currentUser.username,
                        receiverId: post.userId,
                        postId: post._id
                    }
                    await axios.post('/api/notice/post',notice)
                }
                sendNotice()
            }
        }
    }
    const likeHandler= ()=>{
        try{
            const likePost = async ()=>{
                await axios.put('/api/posts/'+post._id+'/like',null)
            };
            likePost()
        }catch(err){

        }
        //如果有喜歡過的話就扣一沒有喜歡過則是加一
        setLike(isLiked ? like-1: like+1)
        setIsLiked(!isLiked)
        if(isLiked===false && currentUser._id!==post.userId){
           //喜歡則發送notice
            const  sendNotice = async ()=>{
                const notice = {
                    senderId : currentUser._id,
                    object : "like",
                    senderPic : currentUser.profilePicture,
                    senderUsername : currentUser.username,
                    receiverId: post.userId,
                    postId: post._id
                }
                await axios.post('/api/notice/post',notice)
            }
            sendNotice()
        }
    }
    const showComment = ()=>{
        if (hideComment === ""){
            setHideComment('none')
        }
        else{
            setHideComment('')
        }
    }
    return (
        <div className="post">
             <div className="postWrapper">
                 <div className="postTop">
                     <div className="postTopLeft">
                         <Link to={`/profile/${user.username}`}>
                         
                         <img src={user.profilePicture ? user.profilePicture : "https://i.imgur.com/HeIi0wU.png"}
                              alt="" 
                              className="postProfileImg"   
                         />
                         </Link>
                         <span className="postUsername">
                             {user.username}
                         </span>
                         <span className="postDate">{format(post.createdAt)}</span>
                     </div>
                     <div className="postTopRight">
                         <MoreVert/>
                     </div>
                 </div>
                 <div className="postCenter">
                     <span className="postText">{post?.desc}</span>
                     <img  className="postImg" src={post.img} alt=""/>
                 </div>
                 <div className="postBottom">
                     <div className="postBottomLeft">
                         <img className="likeIcon" src={"https://i.imgur.com/5OV5nFE.png"} onClick={likeHandler} alt=""/>
                         <img className="HeartIcon" src={"https://i.imgur.com/a5QV3sX.png"} onClick={likeHandler} alt=""/>
                         <span className="postLikeCounter">{like}個喜歡</span>
                     </div>
                     <div className="postBottomRight" onClick={showComment}>
                         <span className="postCommentText">
                             {currentComment.length
                                ? currentComment.length
                                : post.comment ? post.comment.length :"0"
                             }
                             個評論
                        </span>
                     </div>
                 </div>
                 <hr className="postHr"/>
                 <div className="postFunctionArea">
                     <div className="postFunction" onClick={likeHandler}>
                        {isLiked? <ThumbUpOutlined htmlColor="tomato" /> : <ThumbUpOutlined />}
                        <span className="Function">讚</span>
                    </div>
                    <div className="postFunction" onClick={showComment}>
                        <ChatBubbleOutline/>
                        <span className="Function">留言</span>
                    </div>
                    <div className="postFunction">
                        <Share/>
                        <span className="Function">分享</span>
                    </div>
                 </div>
                 <hr className="postHr"/>
                 {/* 超過三則留言就隱藏留言 */}
                 
                 <div className="postComments" style={{display:hideComment}} >
                        {currentComment.length
                            ? currentComment.map((comment)=>{
                                return(
                                    <div className="postSingleComment" key={comment._id}>
                                        <div className="postSingleCommentMain">
                                            <img 
                                                src={comment.userPic? comment.userPic : "https://i.imgur.com/HeIi0wU.png"}
                                                alt="" 
                                                className="postSendCommentImg"   
                                            />
                                            <div className="postCommentArea">
                                                <span className="postCommentUsername"><b>{comment.userName}</b></span>
                                                <span className="postCommentContent">{comment.comment}</span>
                                            </div>
                                        </div>
                                        <div className="postCommentTime">
                                            {format(comment.date)}
                                        </div>
                                    </div>
                                )
                            })
                            : post.comment && post.comment.map((comment)=>{
                                return(
                                    <div className="postSingleComment" key={comment._id}>
                                        <div className="postSingleCommentMain">
                                            <img 
                                                src={comment.userPic? comment.userPic : "https://i.imgur.com/HeIi0wU.png"}
                                                alt="" 
                                                className="postSendCommentImg"   
                                            />
                                            <div className="postCommentArea">
                                                <span className="postCommentUsername"><b>{comment.userName}</b></span>
                                                <span className="postCommentContent">{comment.comment}</span>
                                            </div>
                                        </div>
                                        <div className="postCommentTime">
                                            {format(comment.date)}
                                        </div>
                                    </div>
                                )
                            })         
                        }            
                 </div>

                 <div className="postSendComment">
                        <img src={currentUser.profilePicture ? currentUser.profilePicture : "https://i.imgur.com/HeIi0wU.png"}
                              alt="" 
                              className="postSendCommentImg"   
                        />
                        <div className="commentSendArea">
                            <input
                            placeholder="留言......"
                            className="postSendInput"
                            onKeyPress={sendComment}
                            />
                        </div>
                 </div>
             </div>
        </div>
    )
})

export default Post