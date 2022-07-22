import * as React from "react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../../constants";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import { Button } from "react-bootstrap";

export default function NavBar({ setIsLoggedIn, username }) {
  const nav = useNavigate();

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
          <span className="link">LIKED</span>
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
          <span className="link" onClick={() => nav("/logout")}>
            LOGOUT
          </span>

          {username === "" ? null : (
            <Button
              className="link navbar-pfp"
              variant="secondary"
              onClick={() => nav("/profile")}
            >
              {username}
            </Button>
          )}

          {/* <AccountCircleIcon className="link navbar-pfp" fontSize="large" onClick={()=> nav('/profile')}/> */}

          {/* <Dropdown variant='secondary' className='dropdown'>
            <Dropdown.Toggle variant='secondary' className="dropdown-toggle">
              NICOLE
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/matches">Logout</Dropdown.Item>
              <Dropdown.Item href="#/action-2">View Profile</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>   */}
        </div>
      </nav>
    </>
  );
}
