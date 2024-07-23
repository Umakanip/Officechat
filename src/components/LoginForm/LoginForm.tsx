import React, { useState } from "react";
import Button from "@mui/material/Button";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.tsx";
import axios from "axios";
const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-image: url('/background.jpg');  /* Reference to the image in the public folder */
        background-size: cover;
        background-position: center;
    }
`;

const Wrapper = styled.div`
  width: 420px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(80px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: #fff;
  border-radius: 10px;
  padding: 30px 40px;

  h1 {
    font-size: 36px;
    text-align: center;
  }

  .input-box {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 30px 0;

    input {
      width: 100%;
      height: 100%;
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.2);
      outline: none;
      border-radius: 40px;
      font-size: 16px;
      color: #fff;
      padding: 20px 45px 20px 20px;

      &::placeholder {
        color: #fff;
      }
    }

    .icon {
      position: absolute;
      right: 20px;
      top: 40%;
      transform: translate(-50%);
      font-size: 16px;
      cursor: pointer;
    }
  }

  .remember-forgot {
    display: flex;
    justify-content: space-between;
    font-size: 14.5px;
    margin: -15px 0 15px;

    label input {
      accent-color: #fff;
      margin-right: 4px;
    }

    a {
      color: #fff;
      text-decoration: underline;
    }
  }

  button {
    background: #fff;
    color: #333;
    margin-left: 130px;
  }

  .register-link {
    font-size: 14.5px;
    text-align: center;
    margin: 20px 0 15px;

    p a {
      color: #fff;
      text-decoration: underline;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  interface userData {
    userDetails: any;
  }
  const handleLogin = async () => {
    // Implement your login logic here (e.g., API call)
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          Email: email,
          PasswordHash: password,
        }
      );

      const userDetails = {
        userdata: response.data.userDetails,
        // Add any other user details you want to pass
      };
      // Set user details in context
      setUser(userDetails);
      // console.log("RESPONSE", response.data.userDetails);
      navigate("/chatpage", { state: { userDetails } });
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <form action="">
          <h1>Login</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <FaEye className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/">Forgot password?</a>
          </div>

          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>

          <div className="register-link">
            <p>
              Don't have an account? <a href="/">Signup here</a>
            </p>
          </div>
        </form>
      </Wrapper>
    </>
  );
};

export default LoginForm;
