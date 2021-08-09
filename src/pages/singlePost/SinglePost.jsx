import './singlePost.css'
import Topbar from "../../components/topbar/Topbar"
import Post from "../../components/post/Post"
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
export default function SinglePost() {
    //抓取postid來找使用者貼文
    const [post,setPost] = useState(null)
    const postId = useParams().postId;
    useEffect(() => {
       const getPost = async()=>{
           const res = await axios.get('/api/posts/'+postId)
           setPost(res.data.data)
       }
       getPost()
    }, [postId])
    return (
        <>
        <Topbar/>
        <div className = "singlePost">
            <div className="singlePostLeft"> 
            </div>
            <div className="singlePostCenter">
                {post && <Post post ={post}/>}  
            </div>
            <div className="singlePostRight">

            </div>
        </div>
        </>
    )
}
