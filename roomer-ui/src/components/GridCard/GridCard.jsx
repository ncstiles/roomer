import * as React from "react";
import "./GridCard.css";
import "../../css/card.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HeartBrokenOutlinedIcon from "@mui/icons-material/HeartBrokenOutlined";

// display of card in main grid view.  Directs to DetailCard if card is clicked
export default function GridCard({
  cardUsername,
  inLiked,
  inMatches,
  firstName,
  age,
  gender,
  occupation,
  pfpSrc,
  contentType,
  processHeart,
  processUnheart,
  score,
}) {
  const nav = useNavigate();
  let [clickedHeart, setClickedHeart] = useState(inLiked);
  let [clickedMatch, setClickedMatch] = useState(inMatches);
  let [brokenHeart, setBrokenHeart] = useState("hidden-heart");
  let heartClassName = inMatches ? "heart-match" : "heart";

  const heart = () => {
    processHeart(cardUsername, firstName);
    setClickedHeart(true); // only update setClickedHeart, not setClickedMatch because matches are a subset of likes - if like turns out to be match, it's updated in the useEffect
    setBrokenHeart("hidden-heart");
  };

  const unheart = () => {
    processUnheart(cardUsername);
    setClickedHeart(false);
    setBrokenHeart(`${heartClassName} fade-heart`);
  };

  // for the first render where clickedHeart and clickedMatch are updated before inLiked and inMatches are populated with allUser data
  useEffect(() => {
    setClickedHeart(inLiked);
    setClickedMatch(inMatches);
  }, [inLiked, inMatches]);

  return (
    <>
      <div className="card user-card">
        {clickedHeart || clickedMatch ? (
          <FavoriteIcon className={heartClassName} onClick={unheart} />
        ) : (
          <>
            <HeartBrokenOutlinedIcon className={brokenHeart} />
            <FavoriteBorderOutlinedIcon
              className={heartClassName}
              onClick={heart}
            />
          </>
        )}
        <div onClick={() => nav(`/introduce/${cardUsername}`)}>
          {/* round to nearest integer percentage */}
          <p>{Math.round(score.toFixed(2)*100)}% match</p>
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
