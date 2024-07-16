import React, { useState } from "react";
import Button from '@mui/material/Button';
import './LoginForm.css';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="wrapper">
            <form action="">
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder="Email" required />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                    />
                    {showPassword ? (
                        <FaEye className="icon" onClick={togglePasswordVisibility} />
                    ) : (
                        <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
                    )}
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="/">Forgot password?</a>
                </div>

                {/* <button type="submit">Login</button> */}
                <Button variant="contained">Login</Button>

                <div className="register-link">
                    <p>Don't have an account? <a href="/">Signup here</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
