import './friend.css'

export default function Friend({user}) {
    return (
        <div onClick={() => {window.location.href="/profile/"+user.username}}>
            <li className="sidebarFriend">
                <img src={user.profilePicture === "" ? "https://i.imgur.com/HeIi0wU.png" : user.profilePicture}  alt="" className="sidebarFriendImg" />
                <span className="sidebarFriendName">{user.username}</span>
            </li>
        </div>
    )
}
