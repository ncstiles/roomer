import * as React from "react";
import "./Home.css";
import UserGrid from "../UserGrid/UserGrid"
export default function Home({users}) {
  return (
      <div id='content'>
        <UserGrid users={users}/>
      </div>
  )
}
