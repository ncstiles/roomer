import * as React from "react";
import "./Home.css";
import UserGrid from "../UserGrid/UserGrid";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

export default function Home({
  allUsers,
  isLoading,
  isLoggedIn,
  currentUser,
  addLike,
  removeLike,
  setIsUpdated,
  likedUsers,
  matchedUsers
}) {
  return (
    <>
      {isLoggedIn ? (
        <>
          <h1 className="matches-header">YOUR CUSTOM RECOMMENDATIONS</h1>
          <UserGrid
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
        </>
      ) : (
        <NotAuthorized />
      )}
    </>
  );
}
