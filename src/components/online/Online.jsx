import "./online.css"

export default function Online({user}) {
    return (
        <li className="rightbarFriend">
                    <div className="rightbarProfileImgContainer">
                        <img src={"https://i.imgur.com/HeIi0wU.png"}alt="" className="rightbarProfileImg" />
                        <span className="rightbarOnline"></span>
                    </div>
                    <span className="rightbarUsername">{user.username}</span>
        </li>
    )
}
