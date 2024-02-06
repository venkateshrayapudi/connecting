import { useState, createContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        const checkUser = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        })

        return () => {
            checkUser()
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{ currentUser }}
        >
            {children}
        </AuthContext.Provider>
    )
}
