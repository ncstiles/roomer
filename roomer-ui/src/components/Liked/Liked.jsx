import * as React from "react";
import "./Liked.css";

export default function Liked({ likedUsers }) {
  return (
    <div className="liked-view">
      <h1>Welcome to the liked component</h1>
      {likedUsers.map((label, ix) => (
        <h2 key={ix}>{label} </h2>
      ))}
    </div>
  );
}
