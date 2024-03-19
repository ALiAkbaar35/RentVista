/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { message } from "antd";
import "../../App.css";

const Login = () => {
    const { user, loginUser } = useAuth();
    const navigate = useNavigate();

    // Placeholder for formData and handleChange
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Placeholder for newErrors
    const [newErrors, setnewErrors] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        // Update formData when input values change
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Check for presence of email
        if (!formData.email) {
            isValid = false;
            newErrors.email = "Please enter your email address.";
        } else {
            // Check for valid email format using a regular expression
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                isValid = false;
                newErrors.email = "Please enter a valid email address.";
            }
        }

        // Check for presence of password
        if (!formData.password) {
            isValid = false;
            newErrors.password = "Please enter your password.";
        }

        setnewErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submitting
        if (validateForm()) {
            const email = formData.email;
            const password = formData.password;

            const userInfo = { email, password };

            const check = await loginUser(userInfo);
            if (check) {
                message.success("Login successful");
            } else {
                message.error("Login failed. Please check your credentials.");
            }
        }
    };

    return (
        <div className="flex h-screen bg-slate-800">
            <div className="login-container bg-gray-900 p-6 rounded-lg shadow-md ">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                    Sign in to your account
                    <div>
                        {newErrors.login && (
                            <p className="mt-2 text-red-500 text-sm">
                                {newErrors.login}
                            </p>
                        )}
                    </div>
                </h2>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                    <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                            <input
                                type="email"
                                className="grow"
                                id="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                value={formData.email}/>
                    </label>
                        
                        {newErrors.email && (
                            <p className="mt-2 text-red-500 text-sm">
                                {newErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                className="block text-sm font-medium leading-6 text-white"
                            >
                                
                            </label>
                            <div className="text-sm ">
                                <a
                                    href="#"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div className="mt-4">
                        <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                <input
                               id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                onChange={handleChange}
                                value={formData.password}
                                 className="grow" />
                        </label>
                           
                        </div>
                        {newErrors.password && (
                            <p className="mt-2 text-red-500 text-sm">
                                {newErrors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-white">
                    Dont have an account?
                    <Link
                        to="/Signup"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                        SignUp here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
