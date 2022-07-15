import * as React from "react";
import "./Profile.css";
import { useState, useEffect } from "react";
import { BASE_API_URL } from "../../constants";
import UserGrid from "../UserGrid/UserGrid";
import Update from "../Update/Update";
import Logout from "../Logout/Logout";
import NotAuthorized from "../NotAuthorized/NotAuthorized";
import UserDetail from "../UserDetail/UserDetail";
import UploadPfp from "../UploadPfp/UploadPfp";
import Liked from "../Liked/Liked";
import axios from "axios";

// depending on tab that is toggled, display the correct component
function Subview({
  viewComponent,
  allUsers,
  isLoading,
  registerForm,
  setRegisterForm,
  isLoggedIn,
  setIsLoggedIn,
  setIsUpdated,
  setAvatarFile,
  currentUser,
  addLike,
  removeLike,
  likedUsers,
  likedUserInfo
}) {
  switch (viewComponent) {
    case "own":
      // cardUsername is current user because within Profile we display the user's own info
      return (
        <UserDetail
          isLoggedIn={isLoggedIn}
          showLikeIcon={false}
          fromProfileCardUsername={currentUser}
          addLike={addLike}
          removeLike={removeLike}
          setIsUpdated={setIsUpdated}
        />
      );
    case "matches":
      return (
        <UserGrid
          allUsers={allUsers}
          isLoading={isLoading}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          addLike={addLike}
          removeLike={removeLike}
          setIsUpdated={setIsUpdated}
          likedUsers={likedUsers}
        />
      );
    case "liked":
      return <Liked 
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        addLike={addLike}
        removeLike={removeLike}
        setIsUpdated={setIsUpdated}
        likedUsers={likedUsers}
        likedUserInfo={likedUserInfo}
        />;
    case "messages":
      return <h1>Placeholder for message contacts</h1>;
    case "modify":
      return (
        <Update
          updateForm={registerForm}
          setUpdateForm={setRegisterForm}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          setIsUpdated={setIsUpdated}
        />
      );
    case "pfp":
      return (
        <UploadPfp
          currentUser={currentUser}
          setIsUpdated={setIsUpdated}
          setAvatarFile={setAvatarFile}
        />
      );
    case "logout":
      return <Logout setIsLoggedIn={setIsLoggedIn} />;
    default:
      return null;
  }
}

export default function Profile({
  allUsers,
  isLoading,
  registerForm,
  setRegisterForm,
  isLoggedIn,
  setIsLoggedIn,
  setIsUpdated,
  currentUser,
  addLike,
  removeLike,
  likedUsers,
  likedUserInfo
}) {
  //default is just to view one's own profile
  const [viewComponent, setViewComponent] = useState("own");
  const [avatarFile, setAvatarFile] = useState(null);
  let [pfpDisplay, setPfpDisplay] = useState("pfp-hidden");

  //Whenever a user's profile picture changes,
  //execute GET request to display their updated picture.
  useEffect(() => {
    axios({
      method: "get",
      url: `${BASE_API_URL}/getPfp/${currentUser}`,
    }).then((res) => {
      const file = res.data.file;
      const type = file.contentType;
      const src = file.pfpSrc.toString("base64");
      const img = document.getElementById("pfp");
      if (file) {
        img.src = `data:${type};base64,${src}`;
        setPfpDisplay("");
      }
    });
  }, [avatarFile]);

  return isLoggedIn ? (
    <div className="profile">
      <div className="sidebar">
        <span className="nav-link text-white heading">
          {currentUser.toUpperCase()}'S PROFILE
        </span>
        <img className={`pfp ${pfpDisplay}`} id="pfp" />
        <hr />
        <ul className="sidebar-items nav flex-column mb-auto">
          <li className={`${viewComponent === "own" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("own")}
            >
              My profile
            </span>
          </li>
          <li className={`${viewComponent === "modify" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("modify")}
            >
              Modify information
            </span>
          </li>
          <li className={`${viewComponent === "pfp" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("pfp")}
            >
              Change profile picture
            </span>
          </li>
          <li className={`${viewComponent === "matches" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("matches")}
            >
              Matches
            </span>
          </li>
          <li className={`${viewComponent === "liked" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("liked")}
            >
              Liked
            </span>
          </li>
          <li className={`${viewComponent === "messages" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("messages")}
            >
              Messages
            </span>
          </li>

          <li className={`${viewComponent === "logout" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("logout")}
            >
              Log out
            </span>
          </li>
        </ul>
      </div>
      <div className="content">
        <Subview
          viewComponent={viewComponent}
          allUsers={allUsers}
          isLoading={isLoading}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setIsUpdated={setIsUpdated}
          setAvatarFile={setAvatarFile}
          currentUser={currentUser}
          addLike={addLike}
          removeLike={removeLike}
          likedUsers={likedUsers}
          likedUserInfo={likedUserInfo}
        />
      </div>
    </div>
  ) : (
    <NotAuthorized />
  );
}
