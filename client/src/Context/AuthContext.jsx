
import { useState, useEffect, createContext, useContext} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(()=>{
        const SavedUser = localStorage.getItem("user");
        const SavedToken = localStorage.getItem("token");
        const SavedRole = localStorage.getItem("role");

        if(SavedUser && SavedToken){
            setUser(JSON.parse(SavedUser));
            setToken(SavedToken);
            setRole(SavedRole);
        }
    }, [])
        const LogOut =()=> {
            setUser(null);
            setToken(null);
            setRole(null);
            localStorage.clear();
        
    }
    return (
        <AuthContext.Provider
            value={{user, setUser, token, setToken, role, setRole, LogOut}}
        >
            {children}
        </AuthContext.Provider>
    );
}
export const useAuthContext =()=> useContext(AuthContext);