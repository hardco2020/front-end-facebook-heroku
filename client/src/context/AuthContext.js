import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    // user: {
    //     "profilePicture": "person/3.jpg",
    //     "coverPicture": "post/2.jpg",
    //     "followers": [
    //         "60ebc66deb725c5783ef46a1",
    //         "60ecde5f688a206c94cd60bb"
    //     ],
    //     "followings": [
    //     ],
    //     "isAdmin": false,
    //     "_id": "60ebc2404a6ed456750998b1",
    //     "followins": [
    //         "60ebc2584a6ed456750998b4"
    //     ],
    //     "username": "john",
    //     "email": "newtest04@gmail.com",
    //     "createdAt": "2021-07-12T04:17:04.555Z",
    //     "updatedAt": "2021-07-15T11:00:25.232Z",
    //     "__v": 0,
    //     "city": "台北",
    //     "desc": "轉角遇上霸柴，請你小心",
    //     "from": "台灣",
    //     "relationship": 2 
    // },
    user:null,
    isFetching: false,
    error: false

};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider 
            value={{ 
                user: state.user, 
                isFetching: state.isFetching, 
                error: state.error,
                dispatch
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}