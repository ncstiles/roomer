import * as React from "react";
import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BASE_API_URL } from "../../constants";
import Home from "../Home/Home";
import UserDetail from "../UserDetail/UserDetail";
import NotFound from "../NotFound/NotFound";
import Navbar from "../Navbar/NavBar";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Welcome from "../Welcome/Welcome";
import Profile from "../Profile/Profile";
import Logout from "../Logout/Logout";
import Update from "../Update/Update";

export default function App() {
  axios.defaults.withCredentials = true;
  let [allUsers, setAllUsers] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [username, setUsername] = useState("");
  let [isUpdated, setIsUpdated] = useState(false);

  let [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    rentRange: "",
    occupation: "",
    profession: "",
    addr: "",
    city: "",
    state: "",
    zip: "",
    agePref: "",
    genderPref: "",
    locRad: "",
    insta: "",
    fb: "",
    bio: "",
  });

  let [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  /**
   * Get all basic profile information of people in the db.
   */
  const populatePeople = () => {
    console.log('re-rendering grid')
    console.log('grid rerendered')
    axios({
      method: "get",
      url: BASE_API_URL + "/allBasic",
    }).then((res) => {
      setAllUsers((allUsers = [...res.data.allBasicData]));
    })
  };

  useEffect(() => {
    setIsLoading(true);
    populatePeople();
    setIsLoading(false);
  }, [isUpdated]);

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar setIsLoggedIn={setIsLoggedIn} username={username} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Welcome
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                />
              }
            />
            <Route
              path="/matches"
              element={
                <Home
                  allUsers={allUsers}
                  isLoading={isLoading}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/introduce/:username"
              element={
                <UserDetail
                  className="user-detail"
                  isLoggedIn={isLoggedIn}
                  username={""}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Register
                  className="register"
                  registerForm={registerForm}
                  setRegisterForm={setRegisterForm}
                  setIsLoggedIn={setIsLoggedIn}
                  setIsUpdated={setIsUpdated}
                />
              }
            />
            <Route
              path="/update"
              element={
                <Update
                  updateForm={registerForm}
                  setUpdateForm={setRegisterForm}
                  setIsLoggedIn={setIsLoggedIn}
                  username={username}
                  isUpdated={isUpdated}
                  setIsUpdated={setIsUpdated}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  className="login"
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                  setIsUpdatd={setIsUpdated}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  allUsers={allUsers}
                  isLoading={isLoading}
                  registerForm={registerForm}
                  setRegisterForm={setRegisterForm}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  username={username}
                  setIsUpdated={setIsUpdated}
                />
              }
            />
            <Route
              path="/logout"
              element={
                <Logout
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
