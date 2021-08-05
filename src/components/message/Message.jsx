import './message.css'

export default function Message({own}) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img
                 className="messageImg"
                 src="https://imgur.com/P68DSf9.jpg"
                 alt="" 
                />
                <div className="messageText">而不一樣的是這邊會利用useContext來得到state的狀態
並且在設置的時候是利用context.provider裡的value來規定
使用者會拿到哪些state</div>
            </div>
            <div className="messageBottom">
                1 hour ago
            </div>
        </div>
    )
}
