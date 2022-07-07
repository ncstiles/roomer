import * as React from "react";
import "./UserGrid.css";
import GridCard from "../GridCard/GridCard";
import Loading from "../Loading/Loading";

export default function UserGrid({ allUsers, isLoading, setIsLoading }) {
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
}
