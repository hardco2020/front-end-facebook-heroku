import axios from 'axios';
import { useEffect , useState} from 'react'
import './conversation.css'

export default function Conversation({conversation ,currentUser}) {
    const [user,setUser] = useState(null)


    useEffect(()=>{
        const friendId = conversation.members.find(m=> m !== currentUser._id);

        const getUser = async()=>{
            try{
                const res = await axios(`/api/users?userId=${friendId}`)
                setUser(res.data.data)
            }catch(err){
                console.log(err)
            }
        }
        getUser();
    },[currentUser,conversation])
    return (
        <div className="conversation">
            <img  className="conversationImg" src={user&& user.profilePicture!=="" ?user.profilePicture :"https://i.imgur.com/HeIi0wU.png"} alt="" />
            <span className="conversationName">{user&& user.username}</span>
        </div>
    )
}
