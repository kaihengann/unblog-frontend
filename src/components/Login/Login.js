import React from "react";
import "./Login.css";
import { Redirect } from "react-router-dom";

const Login = ({ onChange, onSubmit, isSignedIn, onDemo }) => {
  if (isSignedIn) return <Redirect to="/" />

  return (
    <div className="loginFormContainer">
          <div className="loginForm">
            <h1>Welcome back</h1>
            <input
              type="text"
              className="loginInput"
              id="usernameInput"
              placeholder="Username"
              onChange={onChange}
            />
            <input
              type="password"
              className="loginInput"
              id="passwordInput"
              placeholder="Password"
              onChange={onChange}
            />
            <button id="loginFormSubmitButton" onClick={onSubmit}>
              Sign In
            </button>
          </div>
          <button id="demoButton" onClick={onDemo}>
            Have a quick look &gt;
          </button>
    </div>
  );
};

export default Login;
