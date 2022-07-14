import * as React from "react";
import "./Home.css";
import UserGrid from "../UserGrid/UserGrid";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

export default function Home({ allUsers, isLoading, isLoggedIn, currentUser }) {
  return (
    <>
      {isLoggedIn ? (
        <UserGrid
          allUsers={allUsers}
          isLoading={isLoading}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
        />
      ) : (
        <NotAuthorized />
      )}
    </>
  );
}
