import * as React from "react";
import "./Home.css";
import UserGrid from "../UserGrid/UserGrid";
export default function Home({ allUsers, isLoading, setIsLoading }) {
  return (
    <div id="content">
      <UserGrid
        allUsers={allUsers}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
