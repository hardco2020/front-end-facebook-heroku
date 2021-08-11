import './messenger.css'
import Topbar from "../../components/topbar/Topbar"
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {io} from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@material-ui/core'
import { message } from 'statuses'
import InfiniteScrollReverse from "react-infinite-scroll-reverse";
export default function Messenger() {
    let location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"))
    const [conversations,setConversations] = useState([]);
    const [currentChat,setCurrentChat] = useState(null);
    const [currentData,setCurrentData] = useState(null);
    const [chatQuery,setChatQuery] = useState("m");
    const [messages,setMessages] = useState([]);
    const [messagePage,setMessagePage] = useState(1);
    const [messageHasMore,setMessageHasMore] = useState(true);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [arrivalMessage,setArrivalMessage] = useState(null);
    const newMessage = useRef("");
    const socket = useRef();
    const scrollRef = useRef();
    useEffect(()=>{
        socket.current = io(process.env.REACT_APP_SOCKET_PORT) //此處要替換成測試andq上線port 
        socket.current.on("getMessage",data=>{
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    },[])

    useEffect(()=>{
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)&&
        setMessages(prev=>[...prev,arrivalMessage])
    },[arrivalMessage,currentChat])

    useEffect(()=>{
        socket.current.emit("addUser",user._id)
        socket.current.on("getUsers",users=>{
            setOnlineUsers(
                user.friends.filter((f)=> users.some((u)=>u.userId===f))
            );
        })
    },[])
    
    useEffect(()=>{
        if(currentChat){
            const getMessages = async()=>{
                try{
                    const res = await axios.get('/api/messages/'+currentChat._id+"/"+0)
                    setMessages(res.data.data)
                }catch(err){
                    console.log(err)
                }
            };
            getMessages();
        }else{
            console.log("沒有送")
        }
    },[currentChat]);
    useEffect(()=>{
        const getConversations = async()=>{
            try{
                const res = await axios.get('/api/conversations/'+user._id)
                setConversations(res.data.data)
            }catch(err){
                console.log(err)
            }
            
        }
        getConversations()
    },[user._id])
    useEffect(()=>{
        scrollRef?.current?.scrollIntoView({behavior:"smooth"});
    },[messages])
    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(newMessage.current.value)
        const message = {
            sender: user._id,
            text: newMessage.current.value,
            conversationId : currentChat._id,
        };
        const receiverId = currentChat.members.find(
            (member)=> member !== user._id
        );

        socket.current.emit("sendMessage",{
            senderId: user._id,
            receiverId,
            text:newMessage.current.value,
        })
        console.log(user._id)
        console.log(receiverId)
        try{
            const res = await axios.post("/api/messages",message);
            setMessages([...messages,res.data.data])
            newMessage.current.value=""
            if(!onlineUsers.includes(receiverId)){
                const  sendNotice = async ()=>{
                    const notice = {
                        senderId : user._id,
                        object : "message",
                        senderPic : user.profilePicture,
                        senderUsername : user.username,
                        receiverId
                    }
                    await axios.post('/api/notice',notice)
                }
                sendNotice()
            }
        }catch(err){
            console.log(err)
        }
    };
    useEffect(()=>{
        try{
            if (location.state.chat){
                console.log(location.state.chat)
                switchChat(location.state.chat)
            }else{
                console.log("wrong")
            }
        }catch(err){
            console.log(err)
        }
    },[])
    const enterSubmit = async(event)=>{
        if(event.key === 'Enter'){
            handleSubmit(event)
        }
    }
    const switchChat = (c)=>{
        setCurrentChat(c)
        //找到chat裡面的圖片 (因為一定有一個是自己，所以先不用管自己 後續利用own去做判斷 如果own就傳user.pc進去
        //所以這邊要做的是找到另一個user的圖片 然後傳進去message裡面 才可以避免request太多次
        const friendId = c.members.find(m=> m !== user._id);
        const getUser = async()=>{
            try{
                const res = await axios(`/api/users?userId=${friendId}`)
                setCurrentData(res.data.data)
            }catch(err){
                console.log(err)
            }
        }
        getUser();
    }
    const fetchMessageData = async()=>{
        const getMessages = async()=>{
            try{
                 const res = await axios.get('/api/messages/'+currentChat._id+"/"+messagePage)
                 console.log(res.data.data)
                 if(res.data.data.length===0){
                     setMessageHasMore(false)
                 }
                 
                 setMessages(prevMessages=>{
                     return([...prevMessages,...res.data.data])
                 });
                 console.log(messages)
                 setMessagePage(messagePage+1)
                 console.log(messagePage)
            }catch(err){
                console.log(err)
            }
        } 
        getMessages()
    }
    return (
        <>
        <Topbar/>
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    {/* <input placeholder="尋找朋友" className="chatMenuInput" type="text" /> */}
                    <h4 className="chatSidebarTitle">正在聊天的視窗</h4>
                    <hr/>
                    {/* 利用query作filter? */}
                    {conversations.map((c)=>(
                        <div onClick={()=>switchChat(c)} key={c._id}>
                            <Conversation conversation={c} currentUser={user} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {
                        currentChat
                    ?    
                    <>
                    <div className="chatBoxTop"  id="scrollableDiv" >
                        {/* 此處加入infintite scroll */}
                        {/* <InfiniteScroll
                        dataLength={messages.length} //This is important field to render the next data
                        next={()=>fetchMessageData()}
                        hasMore={messageHasMore}
                        loader={<div className="onLoading"><CircularProgress  size="20px"/></div>}
                        
                        scrollableTarget="scrollableDiv"
                        // endMessage={
                        // <p style={{ textAlign: 'center' }}>
                        //     <b> "暫時沒有其他通知了！" </b>
                        // </p>
                        // }
                        > */}
                        {messages.map((m)=>(
                            <div ref={scrollRef} key={m._id} >
                            <Message message={m} own={m.sender === user._id} data={m.sender === user._id ?user:currentData} />
                            </div>
                        ))}
                        {/* </InfiniteScroll> */}
                        
                    </div>
                    <div className="chatBoxBottom">
                        <textarea 
                            className="chatMessageInput" 
                            placeholder="寫些什麼吧..."
                            ref = {newMessage}
                            defaultValue  = {newMessage.current.value}
                            onKeyPress={enterSubmit}
                        >
                        </textarea>
                        <button className="chatSubmitButton" onClick={handleSubmit}>送出</button>
                    </div>
    
                    </>
                    :(
                        <span className="noConversationText">找個人來聊聊天吧</span>
                    )}
                </div> 
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                <h4 className="chatSidebarTitle">正在線上的好友</h4>
                <hr/>
                    <ChatOnline 
                        onlineUsers={onlineUsers} 
                        currentId={user._id} 
                        setCurrentChat= {setCurrentChat}
                        switchChat = {switchChat}
                    />
                </div>
            </div>
        </div>
        </>
    )
}
