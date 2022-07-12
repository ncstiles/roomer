import * as React from "react";
import "./Welcome.css";
import Login from "../Login/Login";
export default function Welcome({ loginForm, setLoginForm, isLoggedIn, setIsLoggedIn, setUsername }) {
  return (
    <div className="welcome-page">
      <div className="welcome-message">
        <h1 className="welcome-header">WELCOME TO ROOMER!</h1>
        <h1>
          Here you'll be able to be introduced to, get to know, and potentially
          share a living space with your ideal roommate.
        </h1>
        <h1>Login or register to get started.</h1>
      </div>
      <Login
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUsername={setUsername}
      />
    </div>
  );
}
