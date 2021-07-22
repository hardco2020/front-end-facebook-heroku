import "./post.css"
import { MoreVert } from "@material-ui/icons"
import { useState,useEffect, useContext } from "react"
import axios from "axios"
import {format} from 'timeago.js'
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

export default function Post({post}) {
    const [user,setUser] = useState({});
    const [like,setLike] = useState(post.likes.length)
    const [isLiked,setIsLiked] = useState(false)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;//assets
    const currentUser = JSON.parse(localStorage.getItem("user"))
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
    }
    return (
        <div className="post">
             <div className="postWrapper">
                 <div className="postTop">
                     <div className="postTopLeft">
                         <Link to={`/profile/${user.username}`}>
                         
                         <img src={user.profilePicture ? PF+user.profilePicture : PF+"noAvatar.png"}
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
                     <img  className="postImg" src={PF+post.img} alt=""/>
                 </div>
                 <div className="postBottom">
                     <div className="postBottomLeft">
                         <img className="likeIcon" src={`${PF}like1.png`} onClick={likeHandler} alt=""/>
                         <img className="likeIcon" src={`${PF}heart2.png`} onClick={likeHandler} alt=""/>
                         <span className="postLikeCounter">{like}個喜歡</span>
                     </div>
                     <div className="postBottomRight">
                         <span className="postCommentText">{post.comment}個評論</span>
                     </div>
                 </div>
             </div>
        </div>
    )
}
