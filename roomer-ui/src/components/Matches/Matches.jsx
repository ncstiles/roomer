import * as React from "react";
import "./Matches.css";
import UserGrid from "../UserGrid/UserGrid";
import Loading from "../Loading/Loading";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

export default function Matches({
  isLoading,
  isLoggedIn,
  currentUser,
  processHeart,
  processUnheart,
  setIsUpdated,
  matchedUsers,
  matchedUserInfo,
}) {
  return (
    <div className="liked-view">
      {!currentUser ? (
        <NotAuthorized />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <h1>MATCHES</h1>

              {matchedUserInfo.length === 0 ? (
                <h2 className="no-likes">No matches yet!</h2>
              ) : (
                <UserGrid
                  allUsers={matchedUserInfo}
                  isLoading={isLoading}
                  isLoggedIn={isLoggedIn}
                  currentUser={currentUser}
                  processHeart={processHeart}
                  processUnheart={processUnheart}
                  setIsUpdated={setIsUpdated}
                  likedUsers={matchedUsers}
                  matchedUsers={matchedUsers}
                  type={'match'}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
