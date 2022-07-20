import * as React from "react";
import "./Home.css";
import UserGrid from "../UserGrid/UserGrid";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

export default function Home({
  allUsers,
  isLoading,
  isLoggedIn,
  currentUser,
  processHeart,
  processUnheart,
  setIsUpdated,
  likedUsers,
  matchedUsers
}) {
  return (
    <>
      {isLoggedIn ? (
        <>
          <h1 className="tab-header">YOUR CUSTOM RECOMMENDATIONS</h1>
          <UserGrid
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
        </>
      ) : (
        <NotAuthorized />
      )}
    </>
  );
}
