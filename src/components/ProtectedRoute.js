import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
    const context = useContext(UserContext);
    const location = useLocation();
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    const authUser = (cb) => {
        fetch(process.env.REACT_APP_BACKEND_PATH + "users/auth/verify", {
            headers: {'Content-Type':'application/json', 'Authorization': context.token},
        })
        .then(res=>res.json())
        .then(user=>{
            if (user.status === 401) {
                context.logout();
                cb(false);
            } else {
                cb(true);
            };
        })
        .catch(err=>{
            cb(false);
        });
    };

    useEffect(() => {
        authUser((auth) => {
            if (!auth) {
                navigate("/login?before=" + location.pathname);
            } else {
                setIsAuth(true);
            }
        });
    },[]);
    
    if (isAuth) {
        return children;
    };
};

export default ProtectedRoute;