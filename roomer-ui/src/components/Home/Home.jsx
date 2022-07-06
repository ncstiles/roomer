import * as React from "react";
import "./Home.css";
import UserGrid from "../UserGrid/UserGrid"
export default function Home({allUsers}) {
  return (
      <div id='content'>
        <UserGrid allUsers={allUsers}/>
      </div>
  )
}
