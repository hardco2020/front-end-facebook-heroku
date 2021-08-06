import "./login.css"
import { useContext,useRef } from "react"
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress} from "@material-ui/core"
import { Link } from "react-router-dom";
export default function Login() {
    //也可以用useState但會影響效能
    const email = useRef();
    const password = useRef();
    const {user,isFetching,error,dispatch} = useContext(AuthContext);
    const handleClick =(e) => {
        e.preventDefault();
        loginCall(
            {username:email.current.value ,password: password.current.value},
            dispatch
        );
    }
    console.log(user)
    console.log(error)
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
                        <input 
                            placeholder="電子郵件" 
                             className="loginInput"
                             required 
                             ref={email}/>
                        <input 
                            placeholder="密碼" 
                            type="password" 
                            className="loginInput" 
                            required
                            minLength = "8"
                            ref={password}/>
                        {/* 錯誤訊息回報 */}
                        {error? <span>{error.response.data.message}</span> : null}
                        <button className="loginButton">
                            {isFetching ? <CircularProgress color="white" size="20px"/>:"登入"}
                        </button>          
                    </form>
                    <span className="loginForgot">忘記密碼？</span>  
                    <Link className="loginRegisterLink" to="/register">
                    <button className="loginRegisterButton">
                        {isFetching ? <CircularProgress color="white" size="20px"/>:"創建新帳號"}
                    </button>
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
