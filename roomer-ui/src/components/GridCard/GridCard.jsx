import * as React from "react";
import "./GridCard.css";
import "../../css/card.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HeartBrokenOutlinedIcon from "@mui/icons-material/HeartBrokenOutlined";

// display of card in main grid view.  Directs to DetailCard if card is clicked
export default function GridCard({
  cardUsername,
  inLiked,
  firstName,
  age,
  gender,
  occupation,
  pfpSrc,
  contentType,
  addLike,
  removeLike,
}) {
  const nav = useNavigate();

  let [clickedLike, setClickedLike] = useState(inLiked);
  let [brokenHeart, setBrokenHeart] = useState("hidden-heart");
  const like = () => {
    addLike(cardUsername);
    setClickedLike(true);
    setBrokenHeart("hidden-heart");
  };

  const unlike = () => {
    removeLike(cardUsername);
    setClickedLike(false);
    console.log("in unlike");
    setBrokenHeart("heart fade-heart");
  };
  console.log("broken heart classname:", brokenHeart);
  return (
    <>
      <div className="card user-card">
        {clickedLike ? (
          <FavoriteIcon className="heart" onClick={unlike} />
        ) : (
          <>
            <HeartBrokenOutlinedIcon className={brokenHeart} />
            <FavoriteBorderOutlinedIcon className="heart" onClick={like} />
          </>
        )}
        <div onClick={() => nav(`/introduce/${cardUsername}`)}>
          {pfpSrc ? (
            <img
              className="card-pfp"
              src={`data:${contentType};base64,${pfpSrc}`}
            />
          ) : (
            <AccountCircleIcon id="grid-pfp" />
          )}
          <div className="text-info">
            <span className="bold-text">{firstName}</span>
            <span> {age}</span>
            <span>{gender}</span>
            <span>{occupation}</span>
          </div>
        </div>
      </div>
    </>
  );
}
