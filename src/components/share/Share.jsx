import './share.css'
import {PermMedia,Label,Room,EmojiEmotions, LaptopWindows, Cancel}  from '@material-ui/icons'
import { useContext, useState,useEffect, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
export default function Share() {
    const user = JSON.parse(localStorage.getItem("user"))
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [file,setFile] = useState(null);
    const desc = useRef()
    //upload img to server不是好的主意
    //應該要分開 server
    //console.log(file)
    const submitHandler = (e) =>{
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        }
        const form = new FormData()
        form.append("image",file)
        console.log(form)
        try{
            axios.post("/api/posts",newPost)
            window.location.reload()
            fetch("https://api.imgur.com/3/image/",{
                method:"post",
                headers:{
                    Authorization:"Client-ID 9235f4e0c03ab68" 
                }
                ,body:form
            }).then(data=>data.json().then(data=>{
                console.log(data.data.link)
                axios.post("/api/posts",{
                    userId: user._id,
                    desc: desc.current.value,
                    image: data.data.link
                })
            }))
        }catch(err){

        }
    }
    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src= {user.profilePicture ? PF+user.profilePicture : "https://i.imgur.com/HeIi0wU.png"}alt=""/>
                    <input 
                        placeholder={"你最近在想什麼? "+ user.username}
                        className="shareInput"
                        ref={desc}
                    />
                </div>
                <hr className="shareHr"/>
                {
                    file &&(
                        <div className="shareImgContainer">
                            <img className="shareImg" src={URL.createObjectURL(file)} alt=""/>
                            <Cancel className="shareCancelImg" onClick={()=>setFile(null)} />
                        </div>
                    )
                }
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon"/>
                            <span className="shareOptionText">Photo or Video</span>
                            <input 
                                style= {{display:"none"}}
                                type="file" id="file" 
                                accept=".png,.jpeg,.jpg" 
                                onChange={(e)=>setFile(e.target.files[0])}
                            />
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon"/>
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">分享</button>
                </form>
            </div>
        </div>
    )
}
