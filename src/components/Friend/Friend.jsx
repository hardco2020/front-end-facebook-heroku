import { Link } from 'react-router-dom'
import './friend.css'

export default function Friend({user}) {
    return (
        <Link to={"/profile/"+user.username} style={{textDecoration:"none",color: "inherit"}} >
            <li className="sidebarFriend">
                <img src={user.profilePicture === "" ? "https://i.imgur.com/HeIi0wU.png" : user.profilePicture}  alt="" className="sidebarFriendImg" />
                <span className="sidebarFriendName">{user.username}</span>
            </li>
        </Link>
    )
}
