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
import Matches from "../Matches/Matches";

export default function App() {
  axios.defaults.withCredentials = true;
  let [allUsers, setAllUsers] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [isUpdated, setIsUpdated] = useState(false);
  let [updateLikes, setUpdateLikes] = useState(false);
  let [updateMatches, setUpdateMatches] = useState(false);

  let [currentUser, setCurrentUser] = useState(null);
  let [likedUsers, setLikedUsers] = useState([]);
  let [likedUserInfo, setLikedUserInfo] = useState([]);

  let [matchedUsers, setMatchedUsers] = useState([]);
  let [matchedUserInfo, setMatchedUserInfo] = useState([]);

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

  // Get all basic profile information of people in the db.
  const updateInfo = () => {
    axios({
      method: "get",
      url: `${BASE_API_URL}/getRecs/${currentUser}`,
    })
      .then((res) => {
        setAllUsers((allUsers = [...res.data.orderedBasicInfo]));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Add user to current user's list of liked people
  const addLike = (likedUser) => {
    axios
      .post(BASE_API_URL + "/addLike", {
        currentUser: currentUser,
        likedUser: likedUser,
      })
      .then((res) => {
        if (res.data.update === "like") {
          setUpdateLikes((prevVal) => !prevVal);
        }
        if (res.data.update === "match") {
          setUpdateMatches((prevVal) => !prevVal);
        }
      });
  };

  // Remove user from current user's list of liked people
  const removeLike = (unlikedUser) => {
    axios
      .post(BASE_API_URL + "/removeLike", {
        currentUser: currentUser,
        unlikedUser: unlikedUser,
      })
      .then((res) => {
        if (res.data.update === "unlike") {
          setUpdateLikes((prevVal) => !prevVal);
        }
        if (res.data.update === "unmatch") {
          setUpdateMatches((prevVal) => !prevVal);
        }
      });
  };

  // Get the list of usernames associated with liked profiles by the currently logged in user
  const getLikedUsers = () => {
    let isUserAdded = null;
    axios({
      method: "get",
      url: `${BASE_API_URL}/likedUsers/${currentUser}`,
    })
      .then((res) => {
        isUserAdded =
          res.data.likedUsers.length > likedUsers.length || !likedUsers; // determine if more users were added
        setLikedUsers((likedUsers = res.data.likedUsers));
      })
      .finally(() => {
        if (isUserAdded) {
          // user added, therefore to get new info, need to sort through all user info (updatedLikedInfo is superset of old liked info)
          const updatedLikedInfo = allUsers.filter((person) =>
            likedUsers.includes(person.username)
          );
          setLikedUserInfo((likedUserInfo = updatedLikedInfo));
        } else {
          // user removed, so new set of liked users is subset of old liked user info
          const updatedLikedInfo = likedUserInfo.filter((person) =>
            likedUsers.includes(person.username)
          );
          setLikedUserInfo((likedUserInfo = updatedLikedInfo));
        }
      });
  };

  // Get the list of usernames associated with liked profiles by the currently logged in user
  const getMatchedUsers = () => {
    let isUserAdded = null;
    axios({
      method: "get",
      url: `${BASE_API_URL}/matchedUsers/${currentUser}`,
    })
      .then((res) => {
        isUserAdded = res.data.matchedUsers.length > matchedUsers.length;
        setMatchedUsers((matchedUsers = res.data.matchedUsers));
      })
      .finally(() => {
        if (isUserAdded) {
          // user added
          const updatedMatchInfo = allUsers.filter((person) =>
            matchedUsers.includes(person.username)
          );
          setMatchedUserInfo((matchedUserInfo = updatedMatchInfo));
        } else {
          // user removed
          const updatedMatchInfo = matchedUserInfo.filter((person) =>
            matchedUsers.includes(person.username)
          );
          setMatchedUserInfo((matchedUserInfo = updatedMatchInfo));
        }
      });
  };

  // Only when a new user is registered or the current user's information is updated is all basic information re-pulled.
  useEffect(() => {
    setIsLoading(true);
    if (currentUser) {
      updateInfo();
    }
  }, [isUpdated, currentUser]);

  // Get list of the current user's liked usernames whenever we have new or changed users, or when we navigate between pages (which is when we `updateLikes`)
  useEffect(() => {
    if (currentUser && allUsers.length > 0) {
      getMatchedUsers();
      getLikedUsers();
    }
    // need to update both the liked list and the matches list whenever one of them changes, because the changes spill over
  }, [currentUser, isUpdated, updateLikes, updateMatches, allUsers]);

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
              path="/recommendations"
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
                  matchedUsers={matchedUsers}
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
                  matchedUsers={matchedUsers}
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
                  matchedUsers={matchedUsers}
                  likedUserInfo={likedUserInfo}
                  matchedUserInfo={matchedUserInfo}
                />
              }
            />
            <Route
              path="/liked"
              element={
                <Liked
                  isLoading={isLoading}
                  isLoggedIn={isLoggedIn}
                  currentUser={currentUser}
                  addLike={addLike}
                  removeLike={removeLike}
                  setIsUpdated={setIsUpdated}
                  likedUsers={likedUsers}
                  likedUserInfo={likedUserInfo}
                />
              }
            />
            <Route
              path="/matches"
              element={
                <Matches
                  isLoading={isLoading}
                  isLoggedIn={isLoggedIn}
                  currentUser={currentUser}
                  addLike={addLike}
                  removeLike={removeLike}
                  setIsUpdated={setIsUpdated}
                  matchedUsers={matchedUsers}
                  matchedUserInfo={matchedUserInfo}
                />
              }
            />
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
