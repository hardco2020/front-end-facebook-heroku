import axios from "axios";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import "./register.css"

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history = useHistory()

    const handleClick = async (e) =>{
        e.preventDefault();
        console.log(password.current.value)
        console.log(passwordAgain.current.value)
        if(passwordAgain.current.value !== password.current.value){
            password.current.setCustomValidity("密碼輸入不一致")
        }else{
            const user = {
                username : username.current.value,
                email : email.current.value,
                password : password.current.value        
            }
            try{
                await axios.post("/auth/local/signup",user);
                history.push("/login")
            }catch(err){
                console.log(err)
            }
        }
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
                        <form className="loginBox" onSubmit={handleClick}>
                            <input placeholder="用戶名稱" 
                                ref={username}
                                className="loginInput"
                                required 
                                minLength="3"
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
                    
                            />
                            <button className="loginButton" type="submit">註冊</button>
                        </form>
                        <Link className="loginRegisterLink" to="/login">
                        <button className="loginRegisterButton">
                                去登入
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
