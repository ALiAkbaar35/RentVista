import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const [user, setUser] = useState(storedUserData || null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const loginUser = async (userInfo) => {
        setLoading(true);
        try {
            const apiUrl = `http://localhost:5050/login`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData.userData); 
                localStorage.setItem('userData', JSON.stringify(userData.userData));
                navigate("/");
                setLoading(false);
                return userData;
            } else {
                const error = await response.text();
                console.error(error);
            }
        } catch (error) {
            message.error("Error logging in. Please try again.");
        }

        setLoading(false);
        return null;
    };

    const logoutUser = async () => {
        setUser(null);
        localStorage.removeItem('userData');
        navigate("/login");
    };

    const registerUser = async (userInfo) => {
        setLoading(true);
       
            const apiUrl = `http://localhost:5050/signup`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });

            if (response.ok) {
                const responseData = await response.json();
                const userData = responseData.userData;
                setUser(userData);
                localStorage.setItem('userData', JSON.stringify(userData));
                navigate("/");
                setLoading(false);
                message.success("Registration successful");
            } else {
                message.error("Error registering. Please try again.");
            }
      
        setLoading(false);
    };

    const checkUserStatus = async () => {
        setLoading(false);
    };

    const contextData = {
        user,
        loginUser,
        logoutUser,
        registerUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <span className="loading loading-bars loading-xs"></span>
                    <span className="loading loading-bars loading-sm"></span>
                    <span className="loading loading-bars loading-md"></span>
                    <span className="loading loading-bars loading-lg"></span>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;