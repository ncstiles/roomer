import * as React from "react";
import "./UserGrid.css";
import GridCard from "../GridCard/GridCard";
import Loading from "../Loading/Loading";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

export default function UserGrid({
  allUsers,
  isLoading,
  isLoggedIn,
  currentUser,
  addLike,
  removeLike,
  likedUsers,
}) {
  return (
    <>
      {/* is possible for user to be authenticated but userinfo isn't populated */}
      {isLoggedIn ? (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="matches">
              <div className="user-grid">
                {allUsers.map((user) => {
                  return (
                    <GridCard
                      key={user.username}
                      inLiked={likedUsers && likedUsers.includes(user.username)}
                      currentUser={currentUser}
                      cardUsername={user.username}
                      firstName={user.firstName}
                      age={user.age}
                      gender={user.gender}
                      occupation={user.occupation}
                      pfpSrc={
                        user.pfpSrc ? user.pfpSrc.toString("base64") : null
                      }
                      contentType={user.contentType ? user.contentType : null}
                      addLike={addLike}
                      removeLike={removeLike}
                      score={user.score}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <NotAuthorized />
      )}
    </>
  );
}
