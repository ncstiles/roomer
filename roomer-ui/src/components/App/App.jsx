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
import Register from "../Register/Register";
import Login from "../Login/Login";

export default function App() {
  let [allUsers, setAllUsers] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    rentRange: "",
    occupation: "",
    profession: "",
    addr: "",
    city: "",
    state: "",
    zip: "",
    agePref: "",
    genderPref: "",
    locRad: "",
    insta: "",
    fb: "",
    bio: "",
  });

  /**
   * Get all basic profile information of people in the db.
   */
  const populatePeople = () => {
    setIsLoading(true);
    axios({
      method: "get",
      url: BASE_API_URL + "/allBasic",
    })
      .then((res) => {
        setAllUsers((allUsers = [...res.data.allBasicData]));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    populatePeople();
  }, [registerForm]);

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  allUsers={allUsers}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              }
            />
            <Route
              path="/basic/:username"
              element={<UserDetail className="user-detail" />}
            />
            <Route
              path="/register"
              element={
                <Register
                  className="register"
                  registerForm={registerForm}
                  setRegisterForm={setRegisterForm}
                />
              }
            />
            <Route path="/login" element={<Login className="login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
