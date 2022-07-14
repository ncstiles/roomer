import * as React from "react";
import "./Liked.css";
import { BASE_API_URL } from "../../constants";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Liked({ currentUser, isUpdated }) {
  let [likedUsers, setLikedUsers] = useState([]);

  const getLikedUsers = () => {
    axios({
      method: "get",
      url: `${BASE_API_URL}/likedUsers/${currentUser}`,
    })
      .then((res) => {
        setLikedUsers(res.data.likedUsers);
      })
  };

  useEffect(() => {
    getLikedUsers();
  }, [isUpdated]);
  return (
    <div className="liked-view">
      <h1>Welcome to the liked component</h1>
      {likedUsers.map((label, ix) => (
        <h2 key={ix}>{label} </h2>
      ))}
    </div>
  );
}
