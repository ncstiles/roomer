import * as React from "react";
import "./Logout.css";
import { useEffect } from "react";
import { BASE_API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

export default function Logout({ setIsLoggedIn, setCurrentUser }) {
  const nav = useNavigate();
  useEffect(() => {
    axios({
      method: "get",
      url: BASE_API_URL + "/logout",
    }).then(() => {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }, []);
  });
  return (
    <div className="logout">
      <h1>You have been logged out.</h1>
      <Button
        size="lg"
        className="redirect"
        onClick={() => {
          nav("/login");
        }}>
        Login
      </Button>
      <Button
        size="lg"
        className="redirect"
        onClick={() => {
          nav("/");
        }}>
        Return to home
      </Button>
    </div>
  );
}
