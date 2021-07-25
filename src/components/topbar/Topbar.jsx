import "./topbar.css"
import { Search,Person,Chat,Notifications,ExitToApp} from "@material-ui/icons"
import { MenuItem } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom"
import { useState } from "react";
import axios from "axios";
import AsyncSelect from "react-async-select";
import { useEffect } from "react";
export default function Topbar(){
    let history = useHistory();
    //const [member,setMember] = useState({});
    const [search, setSearch] = useState("");
    const [display,setDisplay] = useState(false);
    const [results,setResults] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const signout = () =>{
        localStorage.clear();
        history.push('/login')
        window.location.reload()
    }
    console.log(results)
    //console.log(member.city)
    //透過user token在對遠端做要求
    useEffect(()=>{
        const searching = async()=>{
            try{
                const searchResult = await axios.get('api/users/search/'+search)
                setResults(searchResult.data.data)

            }catch(err){
                console.log(err)
            }
        };
        searching()
    },[search])
    //此處做切版
    return(
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{textDecoration:"none"}}>
                <span className="logo">HardCo.Social</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">

                    <Search className="searchIcon" />
                    <input
                        placeholder="尋找朋友、貼文或影片"
                        className="searchInput"
                        onChange={(e)=>setSearch(e.target.value)}
                        onFocus ={()=>setDisplay(true)}
                        onBlur ={()=>setDisplay(false)}
                    />
                </div>
                {/* {display &&( */}
                    <div className="autoContainer">
                        {results.map((value)=>{
                            return(
                                <Link to={`/profile/${value.username}`} style={{textDecoration:"none",color: "inherit" }}>
                                    <MenuItem className="searchItem">
                                        <img src={"https://i.imgur.com/HeIi0wU.png"} alt="" className="topbarImg" />
                                        {value.username}
                                    </MenuItem>
                                </Link>
                                
                            )
                        })}
                    </div>
                {/* )}  */}
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="topbarLink">Homepage</span>
                    <span className="topbarLink">Timeline</span>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person/>
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Chat/>
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications/>
                        <span className="topbarIconBadge">1</span>
                    </div>
                </div>
                <Link to={`/profile/${user.username}`}>
                <img src={user.profilePicture ? PF+user.profilePicture : "https://i.imgur.com/HeIi0wU.png"} alt="" className="topbarImg" />
                </Link>
                <div className="topbarIconItem">
                        <ExitToApp/>
                        <span onClick={signout}>登出</span>
                </div>
            </div>
        </div>
    )
}