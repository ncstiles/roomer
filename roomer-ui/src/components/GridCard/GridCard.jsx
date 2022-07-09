import * as React from "react";
import "./GridCard.css";
import "../../css/card.css";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// display of card in main grid view.  Directs to DetailCard if card is clicked
export default function GridCard({ username, firstName, age, gender, occupation }) {
  const nav = useNavigate();
  return (
    <div
      className="card user-card"
      onClick={() => nav(`/introduce/${username}`)}
    >
      <AccountCircleIcon id="grid-pfp" />
      <div className="text-info">
        <span className="bold-text">{firstName}</span>
        <span> {age}</span>
        <span>{gender}</span>
        <span>{occupation}</span>
      </div>
    </div>
  );
}
