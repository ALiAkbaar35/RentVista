import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import MainScreen from "../pages/Dashboard/MainScreen";
import Header from "../components/atoms/Header";
import Sidebar from "../components/atoms/Sidebar";
import Login from "../pages/AuthPages/Login";
import Signup from "../pages/AuthPages/Signup"; // Corrected typo in import
import Logout from "../pages/AuthPages/Logout";
import Profile from "../pages/AuthPages/Profile";
import Department from "../pages/SetupPages/Department/Department";
import Property from "../pages/SetupPages/Property/Property";
import Vendors from "../pages/SetupPages/Vendors/Vendors";


const AppRoutes = () => {
    return (
      <Routes>
        <Route path="Login" element={<Login />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />}>
          <Route path="MainScreen" element={<MainScreen />} />
          <Route path="Sidebar" element={<Sidebar />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="Header" element={<Header />} />
          <Route path="Department" element={<Department />} />
          <Route path="Property" element={<Property />} />
          <Route path="Vendors" element={<Vendors />} />
          <Route path="Logout" element={<Logout />} />           
        </Route>
      </Routes>
    );
};

export default AppRoutes;
