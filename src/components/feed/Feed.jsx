import Share from '../share/Share'
import Post from '../post/Post'
import './feed.css'
import { useEffect,useState } from 'react'
import axios from "axios"
export default function Feed({username}) {
    //proxy設定
    //暫時使用此方式導入jwt Token
    //console.log(username)
    const [posts,setPosts] = useState([]);
    //const user = null
    const user = JSON.parse(localStorage.getItem("user"))
    useEffect(()=>{
        //這邊要用jwt token去呼叫
        //先隨機給一個 因為還沒拉好認證系統
        const fetchPosts = async ()=>{
            const res = username 
             ? await axios.get("/api/posts/profile/"+ username)
             : await axios.get("/api/posts/timeline/all")

            
            //console.log(res.data.data)
            
            //格式不一樣，對格式做調整
            let data = ""
            //username ? data = res.data.data : data = res.data.data
            //console.log(res.data.datax)
            data = res.data.data
            setPosts(data.sort((p1,p2)=>{
                //console.log(p1,p2)
                //console.log(new Date(p2.createdAt)-new Date(p1.createdAt))
                return new Date(p2.createdAt)-new Date(p1.createdAt);
            }));

        };
        fetchPosts();
    },[username]) //只render一次
    
    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username ===user.username) && <Share/>}
                {posts.map((p)=>(
                    //console.log(p.id)
                    <Post key={p._id} post={p}/>
                ))}
            </div>
        </div>
    )
}
