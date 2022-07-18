import * as React from "react";
import "./Matches.css";
import { useNavigate } from "react-router-dom";

export default function Matches() {
  const nav = useNavigate();

  return (
    <div className="match-view">
      <h1>Your matches</h1>
    </div>
  );
}
