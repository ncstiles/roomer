import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export default function NavBar() {
  const nav = useNavigate();
  return (
    <>
      <nav className="navbar">
        <span className="title" onClick={() => nav("/")}>
          ROOMER
        </span>
        <div className="navbar-links">
          <span className="link">MATCHES</span>
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
          <AccountCircleIcon className="link navbar-pfp" fontSize="large" />
        </div>
      </nav>
    </>
  );
}
