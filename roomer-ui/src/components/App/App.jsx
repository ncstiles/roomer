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
import Liked from "../Liked/Liked";

export default function App() {
  axios.defaults.withCredentials = true;
  let [allUsers, setAllUsers] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [isUpdated, setIsUpdated] = useState(false);
  let [updateLikes, setUpdateLikes] = useState(false);
  let [currentUser, setCurrentUser] = useState(null);
  let [likedUsers, setLikedUsers] = useState([]);
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

  // Add user to current user's list of liked people
  const addLike = (likedUser) => {
    axios
      .post(BASE_API_URL + "/addLike", {
        currentUser: currentUser,
        likedUser: likedUser,
      })
      .then(() => {
        setUpdateLikes((prevVal) => !prevVal);
      });
  };

  // Remove user from current user's list of liked people
  const removeLike = (unlikedUser) => {
    axios
      .post(BASE_API_URL + "/removeLike", {
        currentUser: currentUser,
        unlikedUser: unlikedUser,
      })
      .then(() => {
        setUpdateLikes((prevVal) => !prevVal);
      });
  };

  // Get all basic profile information of people in the db.
  const updateInfo = () => {
    axios({
      method: "get",
      url: BASE_API_URL + "/allBasic",
    })
      .then((res) => {
        setAllUsers((allUsers = [...res.data.allBasicData]));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Get the list of usernames associated with liked profiles by the currently logged in user
  const getLikedUsers = () => {
    axios({
      method: "get",
      url: `${BASE_API_URL}/likedUsers/${currentUser}`,
    }).then((res) => {
      setLikedUsers(res.data.likedUsers);
    });
  };

  // Only when a new user is registered or the current user's information is updated is all basic information re-pulled.
  useEffect(() => {
    setIsLoading(true);
    updateInfo();
  }, [isUpdated]);

  // Get list of the current user's liked usernames whenever we have new or changed users, or when we navigate between pages (which is when we `updateLikes`)
  useEffect(() => {
    if (currentUser) {
      getLikedUsers();
    }
  }, [currentUser, isUpdated, updateLikes]);

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar currentUser={currentUser} />
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
                  setIsUpdated={setIsUpdated}
                  setCurrentUser={setCurrentUser}
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
                  currentUser={currentUser}
                  addLike={addLike}
                  removeLike={removeLike}
                  setIsUpdated={setIsUpdated}
                  likedUsers={likedUsers}
                />
              }
            />
            <Route
              path="/introduce/:cardUsername"
              element={
                <UserDetail
                  className="user-detail"
                  isLoggedIn={isLoggedIn}
                  fromProfileCardUsername={null}
                  showLikeIcon={true}
                  addLike={addLike}
                  removeLike={removeLike}
                  setIsUpdated={setIsUpdated}
                  likedUsers={likedUsers}
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
                  currentUser={currentUser}
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
                  setIsUpdated={setIsUpdated}
                  setCurrentUser={setCurrentUser}
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
                  setIsUpdated={setIsUpdated}
                  currentUser={currentUser}
                  addLike={addLike}
                  removeLike={removeLike}
                  likedUsers={likedUsers}
                />
              }
            />
            <Route path="/liked" element={<Liked likedUsers={likedUsers} />} />
            <Route
              path="/logout"
              element={
                <Logout
                  setIsLoggedIn={setIsLoggedIn}
                  setCurrentUser={setCurrentUser}
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
