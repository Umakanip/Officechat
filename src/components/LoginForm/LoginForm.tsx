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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(to bottom right, #4a90e2, #007aff, #5ac8fa);
    }
`;

const Wrapper = styled.div`
  width: 50vw;
  height: 60vh;
  display: grid;
  grid-template-columns: 100%;
  grid-template-areas: "login";
  box-shadow: 0 0 17px 10px rgb(0 0 0 / 30%);
  border-radius: 10px;
  background: white;
  overflow: hidden;

  @media (min-width: 768px) {
    grid-template-columns: 50% 50%;
    grid-template-areas: "design login";
  }

  .design {
  grid-area: design;
  display: none;
  position: relative;

  @media (min-width: 768px) {
    display: block;
  }

  .rotate-45 {
    transform: rotate(-45deg);
  }

  .pill-1 {
    bottom: 0;
    left: -40px;
    position: absolute;
    width: 80px;
    height: 200px;
    background: linear-gradient(#6dbbff, #538dfa, #377c89);
    border-radius: 40px;
  }

  .pill-2 {
    top: -100px;
    left: -80px;
    position: absolute;
    height: 450px;
    width: 220px;
    background: linear-gradient(#6dbbff, #538dfa, #377c89);
    border-radius: 200px;
    border: 30px solid #c5e2e2;
  }

  .pill-3 {
    top: -100px;
    left: 160px;
    position: absolute;
    height: 200px;
    width: 100px;
    background: linear-gradient(#6dbbff, #538dfa, #377c89);
    border-radius: 70px;
  }

  .pill-4 {
    bottom: -180px;
    left: 220px;
    position: absolute;
    height: 300px;
    width: 120px;
    background: linear-gradient(#6dbbff, #538dfa);
    border-radius: 70px;
  }
}

  .login {
    grid-area: login;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;

    h2.title {
      margin: 15px 0;
      padding-bottom: 10px;
    }

    .text-input {
      background: #e6e6e6;
      height: 40px;
      display: flex;
      width: 60%;
      align-items: center;
      border-radius: 10px;
      padding: 0 15px;
      margin: 5px 0;

      input {
        background: none;
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        margin-left: 10px;
      }

      i {
        color: #686868;
      }

      ::placeholder {
        color: #9a9a9a;
      }
    }

    .login-btn {
      width: 48%;
      padding: 10px;
      color: white;
      background: linear-gradient(to right, #4a90e2, #007aff, #5ac8fa);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      margin-top: 10px;
    }

    a {
      font-size: 12px;
      color: #9a9a9a;
      cursor: pointer;
      user-select: none;
      text-decoration: none;
    }

    a.forgot {
      margin-top: 15px;
    }

    .create {
      margin-top: 30px;
      color: #9a9a9a;
      font-size: 12px;

      a {
        text-decoration: none;
        color: #9a9a9a;
      }

      i {
        color: #9a9a9a;
        margin-left: 10px;
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

  const handleLogin = async () => {
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
      };

      setUser(userDetails);
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
        <div className="design">
          <div className="pill-1 rotate-45"></div>
          <div className="pill-2 rotate-45"></div>
          <div className="pill-3 rotate-45"></div>
          <div className="pill-4 rotate-45"></div>
        </div>
        <div className="login">
          <h2 className="title">Clubits Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="text-input">
            <FaUser />
            <input
              type="text"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="text-input">
            {showPassword ? (
              <FaEyeSlash onClick={togglePasswordVisibility} />
            ) : (
              <FaEye onClick={togglePasswordVisibility} />
            )}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button variant="contained" onClick={handleLogin} className="login-btn">
            LOGIN
          </Button>
          <a href="/" className="forgot">Forgot Username/Password?</a>
          <div className="create">
            Don't have an account? <a href="/">Signup here</a>&nbsp;
            <FaUser />
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default LoginForm;
