import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import "./register.css"

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const [error,setError] =useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const history = useHistory()

    const checkPassword = ()=>{
        console.log(password.current.value)
        console.log(passwordAgain.current.value)
        console.log("test")
        if(passwordAgain.current.value !== password.current.value){
            password.current.setCustomValidity("密碼輸入不一致")
        }else{
            password.current.setCustomValidity("")
        }
    }
    const handleClick = async (e) =>{
        e.preventDefault();
        setIsLoading(true)
        console.log(password.current.value)
        console.log(passwordAgain.current.value)
        // if(passwordAgain.current.value !== password.current.value){
        //     password.current.setCustomValidity("密不一致")
        // }else{
        const user = {
            username : username.current.value,
            email : email.current.value,
            password : password.current.value        
        }
        console.log(user)
        try{
            const res = await axios.post("/auth/local/signup",user);
            history.push("/login")
        }catch(err){
            // setError(err.response.data.message)
            console.log(err.response.data.message)
            setError(err.response.data.message)
        }
        setIsLoading(false)
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">HardCo.Social</h3>
                    <span className="loginDesc">
                        和朋友以及周圍的世界在HardCo.Social上建立連結吧.
                    </span>
                </div>
                <div className="loginRight">
                    <div className="loginBox">
                        <form className="loginBox" onSubmit={(e)=>handleClick(e)}>
                            <input placeholder="用戶名稱" 
                                ref={username}
                                className="loginInput"
                                required 
                                minLength="3"
                                maxLength="12"
                            />
                            <input placeholder="電子郵件" 
                                ref={email} 
                                className="loginInput" 
                                required
                                type="email"
                            />
                            <input placeholder="密碼"    
                                ref ={password} 
                                className="loginInput" 
                                type="password"
                                required
                                minLength="8"
                            />
                            <input placeholder="再一次輸入密碼"  
                                ref={passwordAgain}
                                className="loginInput" 
                                type="password"
                                required
                                onChange={checkPassword}
                    
                            />
                            <button className="loginButton" type="submit">
                                {isLoading?<CircularProgress color="white" size="20px"/> :"註冊" }
                            </button>
                        </form>
                        {error!==null ?<span className="errorMessage">{error}</span> : null}
                        <Link className="loginRegisterLink" to="/login">
                        <button className="loginRegisterButton">
                        {isLoading?<CircularProgress color="white" size="20px"/> :"去登入" }
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
