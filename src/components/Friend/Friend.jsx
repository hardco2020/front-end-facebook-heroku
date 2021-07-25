import './friend.css'

export default function Friend({user}) {
    return (
        <li className="sidebarFriend">
            <img src={"https://i.imgur.com/HeIi0wU.png"} alt="" className="sidebarFriendImg" />
            <span className="sidebarFriendName">{user.username}</span>
        </li>
    )
}
