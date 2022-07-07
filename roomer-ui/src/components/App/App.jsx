import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BASE_API_URL } from "../../constants";
import "./App.css";
import Home from "../Home/Home";
import UserDetail from "../UserDetail/UserDetail";
import NotFound from "../NotFound/NotFound";
import Navbar from "../Navbar/NavBar";

export default function App() {
  let [users, setUsers] = useState([]);

  /**
   * Get all basic profile information of people in the db.
   */
  const populatePeople = () => {
    axios({
      method: "get",
      url: BASE_API_URL + "/basic",
    })
      .then((res) => {
        setUsers((users = [...res.data.users]));
      })
  };

  useEffect(() => {
    populatePeople();
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home users={users} />} />
            <Route
              path="/connect/:userId"
              element={<UserDetail className="user-detail" />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
