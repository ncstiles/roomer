import * as React from "react";
import "./UserGrid.css";
import GridCard from "../GridCard/GridCard";
import Loading from "../Loading/Loading";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

export default function UserGrid({ allUsers, isLoading, isLoggedIn }) {
  return (
    <>
      {/* is possible for user to be authenticated but userinfo isn't populated */}
      {isLoggedIn && allUsers.length > 0 ? (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="matches">
              <h1 className="matches-header">YOUR CUSTOM RECOMMENDATIONS</h1>
              <div id="user-grid">
                {allUsers.map((user) => {
                  return (
                    <GridCard
                      key={user.username}
                      username={user.username}
                      firstName={user.firstName}
                      age={user.age}
                      gender={user.gender}
                      occupation={user.occupation}
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
