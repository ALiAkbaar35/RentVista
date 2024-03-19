import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import "../../App.css"; // Import your custom CSS file

const Register = () => {
    const { registerUser } = useAuth();

    // State for formData and errors
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
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
        const newErrors = { name: "", email: "", phone: "", password: "" };

        // Validate name
        const nameRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
        if (!formData.name || formData.name.length < 3 || !nameRegex.test(formData.name)) {
            isValid = false;
            newErrors.name = "Name is required at least 3 characters";
        }


        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            isValid = false;
            newErrors.email = "Valid email is required";
        }

        // Validate phone
        const phoneRegex = /^[0-9]{8}$/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            isValid = false;
            newErrors.phone = "Valid 8-digit phone number is required";
        }

        // Validate password
        if (!formData.password || formData.password.length < 6) {
            isValid = false;
            newErrors.password = "Password is required and must be at least 6 characters";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form before submitting
        if (validateForm()) {
            const userInfo = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            };

          registerUser(userInfo);
        }
    };

    return (
        <div className="flex h-screen bg-slate-800">
        <div className="signup-container p-10 rounded-md shadow-md  bg-gray-900 ">
          <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
          />
          <h2 className="mt-4 text-center text-2xl text-white font-bold leading-9 tracking-tight">
              Sign up for an account
          </h2>
  
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-wrap mb-4">
        <div className="w-full md:w-1/2  md:mb-0 p-2">
            <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input
                type="text"
                className="grow" 
                placeholder="Username"
                id="name"
                name="name"
                autoComplete="name"
                required
                onChange={handleChange}
                value={formData.name}
            />
            </label>
          
        </div>
        <div className="w-full md:w-1/2  md:mb-0 p-2">
        
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
            {errors.email && (
                <p className="mt-2 text-red-500 text-sm">{errors.email}</p>
            )}
        </div>
        <div className="w-full  pl-2 pr-2">
       
        <div className="mt-4">
        <label className="input input-bordered flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
        <input
                type="tel" 
                className="grow"
                placeholder="Phone number"
                id="phone"
                name="phone"
                autoComplete="tel"
                required
                onChange={handleChange}
                value={formData.phone} />
        </label>
        </div>
        {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
        )}
        </div>
        <div className="w-full  pl-2 pr-2">
            
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
        {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
        )}   
        </div>
        <div className="w-full  pl-2 pr-2 mt-4">
           <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign up
            </button>
        </div>
            </div>
                   
                </form>

                <p className="mt-4 text-center text-sm text-white">
                    Already have an account?{" "}
                    <a
                        href="\Login"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                        Log in here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
