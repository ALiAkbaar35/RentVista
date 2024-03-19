import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();
    const [isPopoutVisible, setPopoutVisible] = useState(false);

    const togglePopout = (e) => {
        e.stopPropagation();
        setPopoutVisible(!isPopoutVisible);
    };

    const handleLogout = () => {
        logoutUser();
        setPopoutVisible(false);
        navigate("/login");
    };

    const handleProfileClick = () => {
        console.log("profile clicked");
        navigate("/Profile");
        setPopoutVisible(false);
    };

    const closePopout = () => {
        setPopoutVisible(false);
    };

    useEffect(() => {
        document.addEventListener("click", closePopout);

        return () => {
            document.removeEventListener("click", closePopout);
        };
    }, []);

    return (
        <div className="navbar bg-slate-900 ">
            <div className="flex-1 px-2 lg:flex-none">
                <a className="text-lg font-bold">{user.name}</a>
            </div>
            <div className="flex justify-end flex-1 px-2">
                <div className="flex items-stretch">
                    <a className="btn btn-ghost rounded-btn"
                     onClick={() => navigate("/")}>Home</a>
                    <div className="dropdown dropdown-end ">
                       


                        <div className="avatar placeholder">
                                <div className=" btn btn-ghost rounded-30 bg-neutral text-neutral-content rounded-full w-12"
                                    tabIndex={0}
                                    role="button"
                                   onClick={togglePopout}

                                >
                        <span>{user.name[0] }</span>
                        </div>
                   
                     </div>
                        {isPopoutVisible && (
                            <ul className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                                <li>
                                    <button onClick={handleProfileClick}>Profile</button>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
