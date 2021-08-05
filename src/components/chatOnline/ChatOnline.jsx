import './chatOnline.css'

export default function ChatOnline() {
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img 
                        className="chatOnlineImg"
                        src="https://imgur.com/P68DSf9.jpg"
                        alt="" 
                    />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">John Doe</span>
            </div>
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img 
                        className="chatOnlineImg"
                        src="https://imgur.com/P68DSf9.jpg"
                        alt="" 
                    />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">John Doe</span>
            </div>
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img 
                        className="chatOnlineImg"
                        src="https://imgur.com/P68DSf9.jpg"
                        alt="" 
                    />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">John Doe</span>
            </div>
        </div>
    )
}
