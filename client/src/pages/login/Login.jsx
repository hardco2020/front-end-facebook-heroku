import "./login.css"
import { useContext,useRef } from "react"
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress} from "@material-ui/core"
import { useHistory } from "react-router-dom";
export default function Login() {
    let history = useHistory()
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
                         <span>{error? error.response.data.message : ""}</span>
                        <button className="loginButton">
                            {isFetching ? <CircularProgress color="white" size="20px"/>:"登入"}
                        </button>
                        <span className="loginForgot">忘記密碼？</span>
                        <button className="loginRegisterButton">
                        {isFetching ? <CircularProgress color="white" size="20px"/>:"創建新帳號"}
                        </button>

                        
                    </form>
                </div>
            </div>
        </div>
    )
}
