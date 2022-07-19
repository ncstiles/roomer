import * as React from "react";
import "./Liked.css";
import UserGrid from "../UserGrid/UserGrid";
import Loading from "../Loading/Loading";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

export default function Liked({
  isLoading,
  isLoggedIn,
  currentUser,
  addLike,
  removeLike,
  setIsUpdated,
  likedUsers,
  likedUserInfo,
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
              <h1>LIKES</h1>

              {likedUserInfo.length === 0 ? (
                <h2 className="no-likes">No liked users yet!</h2>
              ) : (
                <UserGrid
                  allUsers={likedUserInfo}
                  isLoading={isLoading}
                  isLoggedIn={isLoggedIn}
                  currentUser={currentUser}
                  addLike={addLike}
                  removeLike={removeLike}
                  setIsUpdated={setIsUpdated}
                  likedUsers={likedUsers}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
