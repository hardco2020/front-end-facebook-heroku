import Share from '../share/Share'
import Post from '../post/Post'
import './feed.css'
import { useEffect,useState,useCallback } from 'react'
import axios from "axios"
import InfiniteScroll from 'react-infinite-scroll-component'
import { Posts } from '../../dummyData'
import { ContactSupportOutlined} from '@material-ui/icons'
import { CircularProgress } from '@material-ui/core'
export default function Feed({username}) {
    //proxy設定
    //暫時使用此方式導入jwt Token
    //console.log(username)
    const [hasMore,setHasMore] = useState(true)
    const [posts,setPosts] = useState([]);
    const [page,setPage]  = useState(0);

    const user = JSON.parse(localStorage.getItem("user"))
    
    const fetchData = async() =>{
        setPage(page+1)
        const fetchPosts = async ()=>{
            const res = username 
             ? await axios.get("/api/posts/profile/"+ username+"/"+page)
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
            await setPosts(prevPosts=>{
                return([...prevPosts,...data])
            });
            //console.log(posts)
            //setHasMore(data)
        };
        fetchPosts();
    }

    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username ===user.username) && <Share/>}
                <InfiniteScroll
                    dataLength={posts.length} //This is important field to render the next data
                    next={fetchData}
                    hasMore={hasMore}
                    loader={<div className="onLoading"><CircularProgress color="gray" size="30px"/></div>}
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>暫時沒有其他文章了！</b>
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
