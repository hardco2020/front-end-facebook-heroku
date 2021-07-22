export const LoginStart = (useCredentials) =>({
    type:"LOGIN_START"
});

export const LoginSuccess = (jwt) =>({
    type:"LOGIN_SUCCESS",
    payload: jwt

});

export const LoginFailure = (error) =>({
    type:"LOGIN_FAILURE",
    payload: error
});

export const Follow = (userId)=>({
    type:"FOLLOW",
    payload:userId
})
export const unFollow = (userId)=>({
    type:"FOLLOW",
    payload:userId
})