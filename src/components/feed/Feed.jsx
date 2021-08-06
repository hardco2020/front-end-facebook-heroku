import Share from '../share/Share'
import Post from '../post/Post'
import './feed.css'
import { useState } from 'react'
import axios from "axios"
import InfiniteScroll from 'react-infinite-scroll-component'
import { CircularProgress } from '@material-ui/core'
import { useEffect } from 'react'
export default function Feed({username}) {
    //proxy設定
    //暫時使用此方式導入jwt Token
    //console.log(username)
    const [hasMore,setHasMore] = useState(true)
    const [posts,setPosts] = useState([]);
    const [page,setPage]  = useState(0);

    const user = JSON.parse(localStorage.getItem("user"))
    useEffect(()=>{
        console.log("我應該先做")
        setPosts([])
        
        const fetchPosts = async ()=>{
            const res = username 
             ? await axios.get("/api/posts/profile/"+ username+"/"+page)
             : await axios.get("/api/posts/timeline/all/"+page)    
            console.log(res.data.data)
            
            if(res.data.data.length===0){
                setHasMore(false)
            }
            setPosts(res.data.data);
            setPage(1) 
        };
        fetchPosts();
    },[username])
    console.log(page)
    console.log(posts.length)
    const fetchData = async() =>{
        //此處用來擋著跑的會比inital state快的問題
        if(page===0){
            console.log("test1")
        }else{
            console.log("test")
            const fetchPosts = async ()=>{
                setPage(page+1)
                console.log(page)
                const res = username 
                ? await axios.get("/api/posts/profile/"+ username+"/"+page )
                : await axios.get("/api/posts/timeline/all/"+page)    
                //console.log(res.data.data)
                
                let data = ""
                //username ? data = res.data.data : data = res.data.data
                //console.log(res.data.datax)
                if(res.data.data.length===0){
                    setHasMore(false)
                }
                data = res.data.data
                data = data.sort((p1,p2)=>{
                    return new Date(p2.createdAt)-new Date(p1.createdAt);})
                setPosts(prevPosts=>{
                    return([...prevPosts,...data])
                });

                
            };
            
            fetchPosts();
        }
    }


    return (
        <div className="feed">
            <div className="feedWrapper" >
                {(!username || username ===user.username) && <Share/>}
                <InfiniteScroll
                    className="feedScrollbar"
                    dataLength={posts.length} //This is important field to render the next data
                    next={fetchData}
                    hasMore={hasMore}
                    loader={<div className="onLoading"><CircularProgress  size="30px"/></div>}
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>{posts.length===0 ? "此人還沒有任何Post喔!" :"暫時沒有其他文章了！"}</b>
                      </p>
                    }                
                >
                {posts.map((p)=>(
                    <Post key={p._id} post={p}/>
                ))} 
                </InfiniteScroll>
            </div>
        </div>
    )
}
