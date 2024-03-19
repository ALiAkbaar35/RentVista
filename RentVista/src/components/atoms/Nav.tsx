import { Link } from "react-router-dom";
import DropDownMenu from "./DropDownMenu";

const Nav = () => {
    return (
        <>
            <div className="flex flex-row justify-start items-center gap-4 m-5 text-white text-xl">
                <div>
                    <Link to="/">Dashboard</Link>
                </div>
                <div>
                    <DropDownMenu />
                </div>
                <div>
                    <Link to="/profiles">Profiles</Link>
                </div>
                <div>
                    <Link to="/">Configuration</Link>
                </div>
            </div>
        </>
    );
};

export default Nav;
