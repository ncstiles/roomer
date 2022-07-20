import * as React from "react";
import "./Liked.css";
import UserGrid from "../UserGrid/UserGrid";
import Loading from "../Loading/Loading";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

export default function Liked({
  isLoading,
  isLoggedIn,
  currentUser,
  processHeart,
  processUnheart,
  likedUsers,
  likedUserInfo,
  matchedUsers,
}) {
  return (
    <div>
      {!currentUser || !isLoggedIn ? (
        <NotAuthorized />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <h1 className='tab-header'>LIKES</h1>

              {likedUserInfo.length === 0 ? (
                <h2 className="no-results">No liked users yet!</h2>
              ) : (
                <UserGrid
                  allUsers={likedUserInfo}
                  isLoading={isLoading}
                  isLoggedIn={isLoggedIn}
                  currentUser={currentUser}
                  processHeart={processHeart}
                  processUnheart={processUnheart}
                  likedUsers={likedUsers}
                  matchedUsers={matchedUsers}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
