import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../firebase"
import addAvatar from "../images/addAvatar.png";

const Register = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {

                        // update profile : add image
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });

                        // create users collection || add user
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });

                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                    } catch (err) {
                        console.log(err);
                        setErr(true);
                        // setLoading(false);
                    }
                });
            });
        } catch (err) {
            setErr(true);
            //   setLoading(false);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Connecting...</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="display name" />
                    <input type="email" placeholder="email" />
                    <input type="password" placeholder="password" />
                    <input style={{ display: 'none' }} type="file" id="profile-pic" />
                    <label htmlFor="profile-pic">
                        <img src={addAvatar} alt="select" />
                        <span>Add an avatar</span>
                    </label>
                    <button>Register</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>Already have an account? <Link to="/login"> Login</Link></p>
            </div>
        </div>
    )
}

export default Register;
