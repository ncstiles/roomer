import * as React from "react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../../constants";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavBar({ setIsLoggedIn }) {
  const nav = useNavigate();

  const logout = () => {
    axios({
      method: "get",
      url: BASE_API_URL + "/logout",
    })
      .then(() => {
        setIsLoggedIn(false);
      })
  };

  return (
    <>
      <nav className="navbar">
        <span className="title" onClick={() => nav("/")}>
          ROOMER
        </span>
        <div className="navbar-links">
          <span className="link" onClick={() => nav("/matches")}>
            MATCHES
          </span>
          <span className="link">RECENTS</span>
          <span className="link">GROUPS</span>
        </div>
        {/*spacer to add distance between left/right sides of navbar */}
        <div className="spacer" />
        <div className="login-profile">
          <span className="link" onClick={() => nav("/login")}>
            LOGIN
          </span>
          <span className="link" onClick={() => nav("/register")}>
            REGISTER
          </span>
          <span className="link" onClick={logout}>
            LOGOUT
          </span>
          <AccountCircleIcon className="link navbar-pfp" fontSize="large" />
        </div>
      </nav>
    </>
  );
}
