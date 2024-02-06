import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Messages from "./Messages";
import Input from "./Input";
import cam from "../images/cam.png";
import add from "../images/add.png";
import more from "../images/more.png";

const Chat = () => {

    const { data } = useContext(ChatContext)

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{data?.user.displayName}</span>
                <div className="chatIcons">
                    <img src={cam} alt="video call" />
                    <img src={add} alt="Add" />
                    <img src={more} alt="more..." />
                </div>
            </div>
            <Messages />
            <Input />
        </div>
    )
}

export default Chat;
