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
import RequestReset from "../RequestReset/RequestReset";
import ResetPassword from "../ResetPassword/ResetPassword";
import { Toast, ToastContainer } from "react-bootstrap";

export default function App() {
  axios.defaults.withCredentials = true;
  let [allUsers, setAllUsers] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [isUpdated, setIsUpdated] = useState(false);
  let [updateLikes, setUpdateLikes] = useState(false);
  let [updateMatches, setUpdateMatches] = useState(false);

  let [currentUser, setCurrentUser] = useState(null);
  let [newlyMatchedUser, setNewlyMatchedUser] = useState("");
  let [likedUsers, setLikedUsers] = useState([]);
  let [likedUserInfo, setLikedUserInfo] = useState([]);

  let [matchedUsers, setMatchedUsers] = useState([]);
  let [matchedUserInfo, setMatchedUserInfo] = useState([]);

  let [showToast, setShowToast] = useState(false);
  
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

  // Add user to current user's list of liked/matched people
  const processHeart = (likedUser, firstName) => {
    axios
      .post(BASE_API_URL + "/heart", {
        currentUser: currentUser,
        likedUser: likedUser,
      })
      .then((res) => {
        if (res.data.update === "like") {
          setUpdateLikes((prevVal) => !prevVal);
        }
        if (res.data.update === "match") {
          setUpdateMatches((prevVal) => !prevVal);
          setNewlyMatchedUser(firstName);
          setShowToast(true);
        }
      });
  };

  // Remove user from current user's list of liked/matched people
  const processUnheart = (unlikedUser) => {
    axios
      .post(BASE_API_URL + "/unheart", {
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

  /**
   * Update the user's list of liked or matched usernames + profiles after heart icon is clicked/unclicked
   *
   * @param {string} endpoint either "likedUsers" or "matchedUsers"
   * @param {Array} usernames existing state variable of usernames in liked/matched list
   * @param {Array} userInfo existing state variable of userInfo in liked/matched list
   * @param {function} setUsernames function to set the usernames state variable
   * @param {function} setInfo function to set the userInfo state variable
   */
  const updateLikesMatches = (
    endpoint,
    usernames,
    userInfo,
    setUsernames,
    setInfo
  ) => {
    let isUserAdded = null;
    axios({
      method: "get",
      url: `${BASE_API_URL}/${endpoint}/${currentUser}`,
    })
      .then((res) => {
        // determine if we need to filter from all users, or if we can just filter from previous subset of liked users
        const resResponse =
          endpoint === "likedUsers"
            ? res.data.likedUsers
            : res.data.matchedUsers;
        isUserAdded =
          resResponse.length > usernames.length ||
          usernames.length === 0 || //usernames and userInfo updated independently hence both cases are included
          userInfo.length === 0;
        setUsernames((usernames = resResponse));
      })
      .finally(() => {
        if (isUserAdded) {
          // user added, therefore to get new info, need to sort through all user info (updatedLikedInfo is superset of old liked info)
          const updatedInfo = allUsers.filter((person) =>
            usernames.includes(person.username)
          );
          setInfo((userInfo = updatedInfo));
        } else {
          // user removed, so new set of liked users is subset of old liked user info
          const updatedInfo = userInfo.filter((person) =>
            usernames.includes(person.username)
          );
          setInfo((userInfo = updatedInfo));
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

  // update the user's list of liked/matched people's usernames and profile info
  useEffect(() => {
    if (currentUser && allUsers.length > 0) {
      updateLikesMatches("likedUsers", likedUsers, likedUserInfo, setLikedUsers, setLikedUserInfo);
      updateLikesMatches( "matchedUsers", matchedUsers, matchedUserInfo, setMatchedUsers, setMatchedUserInfo);
    }
    // need to update both the liked list and the matches list whenever one of them changes, because the changes spill over
    // ex: like becomes match, therefore liked list loses user, matched list gains one
  }, [currentUser, isUpdated, updateLikes, updateMatches, allUsers]);

  return (
    <div className="app">
      <ToastContainer>
        <Toast
          className="toast"
          bg="primary"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header className="p-3 toast-header">
            <strong className="me-auto fs-4">Congrats!</strong>
          </Toast.Header>
          <Toast.Body className="fs-5">
            {" "}
            You just matched with {newlyMatchedUser}!{" "}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <BrowserRouter>
        <Navbar currentUser={currentUser} isLoggedIn={isLoggedIn} />
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
                  processHeart={processHeart}
                  processUnheart={processUnheart}
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
                  processHeart={processHeart}
                  processUnheart={processUnheart}
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
                  setIsLoading={setIsLoading}
                  setCurrentUser={setCurrentUser}
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
                  processHeart={processHeart}
                  processUnheart={processUnheart}
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
                  processHeart={processHeart}
                  processUnheart={processUnheart}
                  likedUsers={likedUsers}
                  likedUserInfo={likedUserInfo}
                  matchedUsers={matchedUsers}
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
                  processHeart={processHeart}
                  processUnheart={processUnheart}
                  setIsUpdated={setIsUpdated}
                  matchedUsers={matchedUsers}
                  matchedUserInfo={matchedUserInfo}
                />
              }
            />
            <Route
              path="/requestReset"
              element={
                <RequestReset
                />
              }
            />
            <Route
              path="/passwordReset"
              element={
                <ResetPassword/>
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
