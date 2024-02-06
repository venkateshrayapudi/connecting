import { useContext, useState } from "react";
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"
import { AuthContext } from "../context/AuthContext";

const Search = () => {

    const [text, setText] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {

        const q = query(collection(db, "users"), where("displayName", "==", text))

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            })
        } catch (error) {
            setErr(true);
        }
    }

    const handleKeyDown = (e) => {
        e.code === "Enter" && handleSearch()
    }

    const handleSelect = async () => {
        // check if chats collection exists in firestore, if not create

        // between two users
        const chatID = currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;

        try {
            const res = await getDoc(doc(db, "chats", chatID));

            if (!res.exists()) {
                // create chat in chats collection
                await setDoc(doc(db, "chats", chatID), { messages: [] })

                // create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [chatID + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [chatID + ".date"]: serverTimestamp()
                })

                await updateDoc(doc(db, "userChats", user.uid), {
                    [chatID + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [chatID + ".date"]: serverTimestamp()
                })
            }
        } catch (error) {
            setErr(true)
        }

        setUser(null);
        setText("");
    }

    return (
        <div className="search">
            <div className="searchForm">
                <input type="text" placeholder="Search a user" onKeyDown={handleKeyDown} value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            {err && <span>User not found</span>}
            {user && <div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>}
        </div>
    )
}

export default Search;
