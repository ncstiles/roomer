import * as React from "react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function NavBar({ isLoggedIn, currentUser }) {
  const nav = useNavigate();

  return (
    <>
      <nav className="navbar">
        <span className="title" onClick={() => nav("/")}>
          ROOMER
        </span>
        <div className="navbar-links">
          <span className="link" onClick={() => nav("/recommendations")}>
            RECOMMENDATIONS
          </span>
          <span className="link" onClick={() => nav("/liked")}>
            LIKED
          </span>
          <span className="link" onClick={() => nav("/matches")}>
            MATCHES
          </span>
        </div>
        {/*spacer to add distance between left/right sides of navbar */}
        <div className="spacer" />
        <div className="login-profile">
          {isLoggedIn && currentUser ? null : (
            <>
              <span className="link" onClick={() => nav("/login")}>
                LOGIN
              </span>
              <span className="link" onClick={() => nav("/register")}>
                REGISTER
              </span>
            </>
          )}

          {!isLoggedIn || !currentUser ? null : (
            <Button
              className="link navbar-pfp"
              variant="secondary"
              onClick={() => nav("/profile")}
            >
              {currentUser}
            </Button>
          )}

          <>
            {isLoggedIn && currentUser ? (
              <span className="link" onClick={() => nav("/logout")}>
                LOGOUT
              </span>
            ) : null}
          </>
        </div>
      </nav>
    </>
  );
}
