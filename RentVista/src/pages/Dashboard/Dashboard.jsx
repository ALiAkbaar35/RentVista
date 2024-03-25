// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState } from "react";
import { Layout, ConfigProvider } from "antd";
import Sidebar from "../../components/atoms/Sidebar";
import Footer from "../../components/atoms/Footer";
import CustomHeader from "../../components/atoms/Header";
import { useAuth } from "../../contexts/authContext";
import { Outlet, Navigate } from "react-router-dom";
import "../../App.css";
const { Content, Sider  } = Layout;
const App = () => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#00BFFF",
                },
            }}
        >
            <Layout
                className="bg-[#2d3748]"
                style={{ minHeight: "100vh", background: "#2d3748" }}
            >
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => {
                    }}
                    onCollapse={(collapsed, type) => {
                    }}
                    //   style={{
                    //     overflow: 'auto',
                    //     height: '100vh',
                    //     position: 'fixed',

                    // }}
                >
                    <Sidebar />
                </Sider>
                <Layout
                    style={{
                        background: "#2d3748",
                    }}
                >
                    <CustomHeader
                        style={{
                            position: 'fixed',
                            background: "#2d3748",
                        }}
                    ></CustomHeader>

                    <Content
                        style={{
                            margin: "24px 16px", // Adjust margin to provide spacing from the sidebar
                            minHeight: 360,
                            background: "#2d3748",
                        }}
                    >
                        <div>
                            <Outlet />
                        </div>
                        
                    </Content>
                    
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default App;
