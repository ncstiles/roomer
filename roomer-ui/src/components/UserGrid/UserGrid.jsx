import * as React from "react";
import "./UserGrid.css";
import GridCard from "../GridCard/GridCard";

export default function UserGrid({ users }) {
  return (
    <div id="user-grid">
      {users.map((user) => {
        return (
          <GridCard
            key = {user.id}
            id = {user.id}
            name={user.name}
            age={user.age}
            location={user.location}
            occupation={user.occupation}
          />
        );
      })}
    </div>
  );
}
