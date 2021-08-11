
import axios from 'axios'
import { decodeToken } from 'react-jwt';
import jwt_decode from "jwt-decode";
export const loginCall = async (userCredential,dispatch)=>{
    dispatch({type:"LOGIN_START"});
    try{
        console.log(userCredential)
        const res = await axios.post("auth/local/signin",userCredential)
        console.log(res.data.data)
        // axios.defaults.headers.common['Authorization'] = 'Bearer '+res.data.data;
        //此處應該要在用Token去fetch user data回來
        axios.interceptors.request.use(function (config) {
            config.headers.Authorization = "Bearer "+res.data.data  ;
            return config;
        });
        const user = jwt_decode(res.data.data)
        console.log(res.data.data)
        console.log(user)
        const user_data  = await axios.get(`/api/users?userId=${user._id}`)
        console.log(res.data.data)
        localStorage.setItem('token',res.data.data)
        localStorage.setItem('user',JSON.stringify(user_data.data.data)) 
        dispatch({type:"LOGIN_SUCCESS",payload:user_data.data.data});
        window.location.reload()
    }catch(e){
        if (e) {
            console.log(e) // some reason error message
          }
        dispatch({type:"LOGIN_FAILURE",payload:e});
    }
}