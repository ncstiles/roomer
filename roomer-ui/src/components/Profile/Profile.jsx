import * as React from "react";
import "./Profile.css";
import { useState } from "react";
import UserGrid from "../UserGrid/UserGrid";
import Update from "../Update/Update";
import Logout from "../Logout/Logout";
import NotAuthorized from "../NotAuthorized/NotAuthorized";
import UserDetail from "../UserDetail/UserDetail";

// depending on tab that is toggled, display the correct component
function Subview({
  viewComponent,
  allUsers,
  isLoading,
  registerForm,
  setRegisterForm,
  isLoggedIn,
  setIsLoggedIn,
  username,
  setIsUpdated,
}) {
  switch (viewComponent) {
    case "own":
      return <UserDetail isLoggedIn={isLoggedIn} username={username} />;
    case "matches":
      return (
        <UserGrid
          allUsers={allUsers}
          isLoading={isLoading}
          isLoggedIn={isLoggedIn}
        />
      );
    case "liked":
      return <h1>Placeholder for list of previously liked contacts</h1>;
    case "messages":
      return <h1>Placeholder for message contacts</h1>;
    case "modify":
      return (
        <Update
          updateForm={registerForm}
          setUpdateForm={setRegisterForm}
          isLoggedIn={isLoggedIn}
          username={username}
          setIsUpdated={setIsUpdated}
        />
      );
    case "pfp":
      return <h1>Placeholder for uploading profile picture</h1>;
    case "logout":
      return <Logout setIsLoggedIn={setIsLoggedIn} />;
    default:
      return null;
  }
}

export default function Profile({ allUsers, isLoading, registerForm, setRegisterForm, isLoggedIn, setIsLoggedIn, username, setIsUpdated }) {
  //default is just to view one's own profile
  const [viewComponent, setViewComponent] = useState("own");

  return isLoggedIn ? (
    <div className="profile">
      <div className="sidebar">
        <span className="nav-link text-white heading">
          {username.toUpperCase()}'S PROFILE
        </span>
        <hr />
        <ul className="sidebar-items nav flex-column mb-auto">
          <li className={`${viewComponent === "own" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("own")}>
              My profile
            </span>
          </li>
          <li className={`${viewComponent === "modify" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("modify")}>
              Modify information
            </span>
          </li>
          <li className={`${viewComponent === "pfp" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("pfp")}>
              Upload profile picture
            </span>
          </li>
          <li className={`${viewComponent === "matches" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("matches")}>
              Matches
            </span>
          </li>
          <li className={`${viewComponent === "liked" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("liked")}>
              Liked
            </span>
          </li>
          <li className={`${viewComponent === "messages" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("messages")}>
              Messages
            </span>
          </li>

          <li className={`${viewComponent === "logout" ? "highlight" : ""}`}>
            <span
              className="nav-link text-white"
              onClick={() => setViewComponent("logout")}>
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
          username={username}
          setIsUpdated={setIsUpdated}
        />
      </div>
    </div>
  ) : (
    <NotAuthorized />
  );
}
