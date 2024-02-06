import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable, } from "firebase/storage"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext"
import { db, storage } from "../firebase"
import { v4 as uuid } from "uuid"
import add from "../images/add.png"
import attach from "../images/attach.png"

const Input = () => {

    const [text, setText] = useState("")
    const [img, setImg] = useState(null)
    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)

    const handleSend = async (e) => {

        e.preventDefault();

        if (img) {

            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img)

            uploadTask.on(
                (error) => {
                    // 
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            })
                        })
                    })
                }
            )

        } else {

            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".data"]: serverTimestamp()
        })

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        })

        setText("")
        setImg(null)
    }

    return (
        <form className="input" onSubmit={handleSend}>
            <input type="text" placeholder="Type your message" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="send">
                <img src={add} alt="add" />
                <input type="file" style={{ display: 'none' }} id="file" onChange={(e) => setImg(e.target.files[0])} />
                <label htmlFor="file">
                    <img src={attach} alt="attachment" />
                </label>
                <button type="submit">Send</button>
            </div>
        </form>
    )
}

export default Input;
