import React, { useState } from "react";
import Button from "@mui/material/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.tsx";
import axios from "axios";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #fff;
  padding: 0;
  box-shadow: 5px 5px 10px 1px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  .side-image {
    background-image: url("/login_image.png");
    background-position: center;
    margin-bottom: 100px;
    background-size: contain;
    background-repeat: no-repeat;
    border-radius: 10px 0 0 10px;
    position: relative;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      p {
        color: #fff;
        font-size: 20px;
      }
      i {
        font-weight: 400;
        font-size: 15px;
      }
    }
  }

  .right {
    display: flex;
    margin-left: 150px;
    align-items: center;
    width: 50%;
    position: relative;
    .input-box {
      width: 330px;
      box-sizing: border-box;
      h1 {
        font-weight: 700;
        font-size: 50px;
        text-align: center;
        margin-bottom: 45px;
        color: #55565B; 
      }
      .input-field {
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 0 10px;
        input {
          height: 45px;
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          outline: none;
          margin-bottom: 20px;
          color: #40414a;
          &:focus,
          &:valid {
            border-bottom: 1px solid #743ae1;
          }
          &:focus ~ label,
          &:valid ~ label {
            top: -10px;
            font-size: 13px;
            color: #5d5076;
          }
        }
        label {
          position: absolute;
          top: 10px;
          left: 10px;
          pointer-events: none;
          transition: .5s;
          color: #75767B;
        }
        .icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      }
      .submit {
        margin-top: 10px;
        margin-left: 90px;
        border: none;
        outline: none;
        height: 45px;
        width: 150px;
        background: #f1b04c;
        border-radius: 5px;
        transition: .4s;
        &:hover {
        background: #f97613;
          color: #fff;
        }
      }
      .signUp {
        text-align: center;
        font-size: medium;
        margin-top: 25px;
        span a {
          font-weight: 450;
          color: #000;
          transition: .5s;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    .side-image {
      width: 100%;
      height: 50%;
      border-radius: 10px 10px 0 0;
    }
    .right {
      width: 100%;
      .input-box {
        width: 100%;
        padding: 0 20px;
        h1 {
          margin-top: 20px;
        }
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
        <div className="side-image">
          <img src="clubits.png" alt="logo" style={{ position: "absolute", top: "30px", left: "30px", width: "150px" }} />
        </div>
        <div className="right">
          <div className="input-box">
            <h1>Login</h1>
            <div className="input-field">
              <input
                type="text"
                className="input"
                id="email"
                required
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                id="pass"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="pass">Password</label>
              {showPassword ? (
                <FaEyeSlash onClick={togglePasswordVisibility} className="icon" />
              ) : (
                <FaEye onClick={togglePasswordVisibility} className="icon" />
              )}
            </div>
            <a href="/" style={{ color: '#006FFC', marginLeft: '200px', cursor: 'no-drop' }}>Forgot Password?</a><br /><br />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button variant="contained" onClick={handleLogin} className="submit">
              LOGIN
            </Button>
            <div className="signUp">
              <span style={{ color: '#75767B' }}>Don't have an account? <a href="/" style={{ color: '#006FFC', cursor: 'no-drop' }}>Signup here</a></span>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default LoginForm;
