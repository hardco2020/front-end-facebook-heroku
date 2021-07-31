import './sidebar.css'
import {RssFeed,Group,Bookmark,HelpOutline,WorkOutline,Event,Chat,School,PlayCircleFilledOutlined} from '@material-ui/icons'
import { Users } from '../../dummyData'
import Friend from '../Friend/Friend'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
export default function Sidebar(){
    const [user,setUser] = useState([])
    useEffect(()=>{
        const fetchUser = async ()=>{
            const res = await axios.get(
                '/api/users/recommend',
                // config
            )
            setUser(res.data.data)
        };
        fetchUser()      
    },[])
    return(
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <RssFeed className="sidebarIcon"/>
                        <span className="sidebarListItemText">Feed</span>
                    </li>
                    <li className="sidebarListItem">
                        <Chat className="sidebarIcon"/>
                        <span className="sidebarListItemText">Chats</span>
                    </li>
                    <li className="sidebarListItem">
                        <PlayCircleFilledOutlined className="sidebarIcon"/>
                        <span className="sidebarListItemText">Videos</span>
                    </li>
                    <li className="sidebarListItem">
                        <Group className="sidebarIcon"/>
                        <span className="sidebarListItemText">Groups</span>
                    </li>
                    <li className="sidebarListItem">
                        <Bookmark className="sidebarIcon"/>
                        <span className="sidebarListItemText">Bookmarks</span>
                    </li>
                    <li className="sidebarListItem">
                        <HelpOutline className="sidebarIcon"/>
                        <span className="sidebarListItemText">Questions</span>
                    </li>
                    <li className="sidebarListItem">
                        <WorkOutline className="sidebarIcon"/>
                        <span className="sidebarListItemText">Jobs</span>
                    </li>
                    <li className="sidebarListItem">
                        <Event className="sidebarIcon"/>
                        <span className="sidebarListItemText">Events</span>
                    </li>
                    <li className="sidebarListItem">
                        <School className="sidebarIcon"/>
                        <span className="sidebarListItemText">Courses</span>
                    </li>
                </ul>
                <button className="sidebarButton">顯示更多</button>
                <hr className="sidebarHr"/>
                <ul className="sidebarFriendList">
                <h4 className="rightbarTitle">推薦好友</h4>
                    {user.map(u=>(
                        <Friend user={u} key={u._id}/>
                    ))}
                </ul>
            </div>
        </div>
    )
}