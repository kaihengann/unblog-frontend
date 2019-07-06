import React from "react";
import "./Login.css";
import { Redirect } from "react-router-dom";

const Login = ({ onChange, onSubmit, isSignedIn }) => {
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
              type="text"
              className="loginInput"
              id="passwordInput"
              placeholder="Password"
              onChange={onChange}
            />
            <button id="loginFormSubmitButton" onClick={onSubmit}>
              Sign In
            </button>
          </div>
    </div>
  );
};

export default Login;
