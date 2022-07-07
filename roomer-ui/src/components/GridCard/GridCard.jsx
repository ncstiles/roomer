import * as React from "react";
import "./GridCard.css";
import "../../css/card.css";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function GridCard({id, name, age, location, occupation}) {
  const nav = useNavigate();
  return (
    <div className="card user-card" onClick={() => nav(`/connect/${id}`)}>
      <AccountCircleIcon id="grid-pfp" />
      <div className="text-info">
        <span className="bold-text">{name}</span>
        <span> {age}</span>
        <span>{location}</span>
        <span>{occupation}</span>
      </div>
    </div>
  );
}
