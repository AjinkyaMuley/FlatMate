import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth,setAuth] = useState({
        userId : null,
        userInfo : null,
        token : null,
        user_login : false
    })

    const login = (userId,userInfo,token,user_login) => {
        setAuth({userId:userId,userInfo:userInfo,token:token,user_login:user_login})
    };

    const logout = () => {
        setAuth({userId : null,userInfo : null,token : null,user_login : false})
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user_login')
    };

    return (
        <AuthContext.Provider value={{auth,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};