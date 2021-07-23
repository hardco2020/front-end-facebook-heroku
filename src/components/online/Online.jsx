import "./online.css"

export default function Online({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
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
