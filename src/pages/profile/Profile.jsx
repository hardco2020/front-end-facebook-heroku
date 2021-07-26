import './profile.css'
import Topbar from "../../components/topbar/Topbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Feed from "../../components/feed/Feed"
import Rightbar from "../../components/rightbar/Rightbar"
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useParams} from 'react-router'
import { TextField, Button,IconButton } from '@material-ui/core'
import { Edit,LocationCity,Language,FavoriteBorder,HighlightOff,PhotoLibrary } from '@material-ui/icons'
import { Countries ,City} from '../../dummyData'
import Popup from '../../components/popup/Popup'
import { useRef } from 'react'
export default function Profile() {
    const currentUser = JSON.parse(localStorage.getItem("user"))
    const [user,setUser] = useState({});
    const [popup,setPopup] = useState(false);
    const username = useParams().username;
    
    //修改個人檔案
    const [editProfile,setEditProfile] = useState(null);
    const [editCover,setEditCover] = useState(null);
    const country = useRef();
    const city = useRef();
    const desc = useRef();
    const relationship = useRef();

    const handleEditFile = async()=>{
        //先確認圖片有沒有做更改 此處要上線才能測試
        let coverUrl = null
        let profileUrl = null
        if(editProfile===null || editProfile===undefined){
            console.log("沒換照片")
        }else{
            //呼叫 imgur api 回傳網址
            const form = new FormData()
            form.append("image",editProfile)
            const url = await fetch("https://api.imgur.com/3/image/",{
                method:"post",
                headers:{
                    Authorization:"Client-ID 9235f4e0c03ab68" 
                }
                ,body:form
                })
            console.log(url.json())
            profileUrl = url.json()
        }
        if(editCover===null || editCover===undefined){
            console.log("沒換封面")
        }else{
            const form = new FormData()
            form.append("image",editCover)
            const url = await fetch("https://api.imgur.com/3/image/",{
                method:"post",
                headers:{
                    Authorization:"Client-ID 9235f4e0c03ab68" 
                }
                ,body:form
                })
            coverUrl = url.json()
        }
        //更新本地資訊
        console.log(coverUrl,profileUrl)
        currentUser.from = country.current.value
        currentUser.city = city.current.value
        currentUser.relationship = relationship.current.value
        currentUser.desc = desc.current.value
        console.log(currentUser)
        localStorage.setItem("user",JSON.stringify(currentUser))
        const update = {
            city:city.current.value,
            from:country.current.value,
            desc: desc.current.value,
            relationship:relationship.current.value
        }
        console.log(update)
        //更新遠端
        const updateResult = await axios.put('/api/users/',update)
        console.log(updateResult)
    }


    useEffect(()=>{
        //這邊要用jwt token去呼叫
        //先隨機給一個 因為還沒拉好認證系統
        const fetchUser = async ()=>{
            const res = await axios.get(
                `/api/users?username=${username}`,
            );
            //console.log(res.data.data)
            setUser(res.data.data)
        };
        fetchUser();
    },[username]) //只render一次

    return (
        <>
        <Topbar/>
        <div className="profile">
            <Sidebar/>
            <div className="profileRight">
                <div className="profileRightTop">
                    <div className="profileCover">
                        <img src={ user.coverPicture ? user.coverPicture : "https://i.imgur.com/kM5r80s.jpg"}
                             alt="" 
                             className="profileCoverImg" 
                        />
                        <img src={ user.profilePicture? user.profilePicture :"https://i.imgur.com/HeIi0wU.png"}
                             alt="" 
                             className="profileUserImg" 
                        />
                    </div>
                    <div className="profileInfo">
                        <h4 className="profileInfoName">{user.username}</h4>
                        <span className="profileInfoDesc">{user.desc}</span>
                        {currentUser.username === user.username &&(
                            <>
                            <Button startIcon={<Edit/>} onClick={()=>setPopup(true)}>編輯個人檔案</Button>
                            <Popup trigger={popup}>
                                <div className="editProfile">
                                    <div className="editTitleArea">
                                        <h1 className="editTitle">編輯個人檔案</h1>
                                        <IconButton aria-label="delete" onClick={()=>setPopup(false)}>
                                            <HighlightOff/>
                                        </IconButton>
                                    </div>
                                    <hr/>
                                    <div className="editProfileImg">
                                        <h2 className ="editItemTitle">大頭貼</h2>
                                            <div className="editProfileImgArea">
                                                <img 
                                                    src={ editProfile ? URL.createObjectURL(editProfile) : user.profilePicture } 
                                                    alt=""
                                                    className="editProfileImgDisplay" 
                                                    
                                                />
                                                <label htmlFor="file1" className="addProfilePic">
                                                    <PhotoLibrary htmlColor="tomato" className="shareIcon"/>
                                                    <span>新增大頭貼</span>
                                                    <input 
                                                        style= {{display:"none"}}
                                                        type="file" id="file1" 
                                                        accept=".png,.jpeg,.jpg" 
                                                        onChange={(e)=>setEditProfile(e.target.files[0])}
                                                    />
                                                </label>
                                            </div>
                                    </div>
                                    <div className="editCoverImg">
                                        <h2 className ="editItemTitle">封面圖片</h2>
                                        <div className="editCoverImgArea">
                                            <img 
                                                    src={ editCover ? URL.createObjectURL(editCover) : user.coverPicture } 
                                                    alt=""
                                                    className="editCoverImgDisplay" 
                                            />
                                            <label htmlFor="file2" className="addCoverPic">
                                                    <PhotoLibrary className="shareIcon"/>
                                                    <span>新增封面照片</span>
                                                    <input 
                                                        style= {{display:"none"}}
                                                        type="file" id="file2" 
                                                        accept=".png,.jpeg,.jpg" 
                                                        onChange={(e)=>setEditCover(e.target.files[0])}
                                                    />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="editDesc">
                                        <h2 className ="editItemTitle">自我介紹</h2>
                                        <TextField
                                            style={{width:"100%"}}
                                            defaultValue={user.desc}
                                            inputRef={desc}
                                        />               
                                    </div>
                                    <div className="editInfo">
                                        <h2 className ="editItemTitle">用戶資訊</h2>
                                        <div className="editInfoArea">
                                            <LocationCity/>
                                            <span className="editInfoTitle">城市:</span>
                                                <select className="editInfoOption" ref={city} defaultValue={user.city}>
                                                    {City.map(city=>{
                                                        
                                                        return(    
                                                            <option value={city.name} key={city.name}>{city.name}</option>
                                                        )
                                                    })}
                                                </select>
                                            <Language/>
                                            <span className="editInfoTitle">國家:</span>
                                                <select className="editInfoOption" ref={country}  defaultValue={user.from}>
                                                    {Countries.map(country=>{
                                                        return(    
                                                                    <option value={country.cn} key={country.cn}>{country.cn}</option>
                                                                )
                                                    })}
                                                </select>
                                            <FavoriteBorder/>
                                            <span className="editInfoTitle">感情狀態:</span>
                                                <select className="editInfoOption" ref={relationship} defaultValue={2}>
                                                    <option value={2} >甜蜜交往中</option>
                                                    <option value={1} >單身</option>
                                                </select>
                                        </div>
                                        <div className="editSend">
                                            <Button 
                                                style={{backgroundColor:"#42b72a"}}
                                                onClick={handleEditFile}
                                            >
                                                送出
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                            </>
                        )}
                    </div>
                </div>
                <div className="profileRightBottom">
                    <Feed username={username}/>
                    <Rightbar user={user}/> 
                </div>
            </div>     
        </div>
        
        </>
    )
}
