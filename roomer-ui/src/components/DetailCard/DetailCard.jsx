import * as React from "react";
import "./DetailCard.css";
import "../../css/card.css";
import { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HeartBrokenOutlinedIcon from "@mui/icons-material/HeartBrokenOutlined";

// DetailCard has 4 views: basic, housing, preferences, and extra info.
// Only the basic view includes a profile picture, so there is a unique className `card-two-rows` to account for its styling.
// All classes but extra info have two columns of text, so there is a unique className `two-cols` to account for their styling.
export default function DetailCard({
  cardType,
  labels,
  allInfo,
  pfpSrc,
  cardUsername,
  contentType,
  showLikeIcon,
  processHeart,
  processUnheart,
  inLiked,
  inMatches
}) {
  // basic card includes pfp, so we need two "rows" of content on the card.
  // toggle className appropriately
  const basicClass = cardType === "basic" ? "card-two-rows" : "card-one-row";
  let [clickedHeart, setClickedHeart] = useState(inLiked);
  let [clickedMatch, setClickedMatch] = useState(inMatches)
  let [brokenHeart, setBrokenHeart] = useState("hidden-heart");
  let heartClassName = inMatches ? "heart-match" : "heart"
  
  const heart = () => {
    processHeart(cardUsername, allInfo[0]); // allInfo[0] is firstname so we can display toast
    setClickedHeart(true); // only update setClickedHeart, not setClickedMatch because matches are a subset of likes - if like turns out to be match, it's updated in the useEffect
    setBrokenHeart("hidden-heart");
  };

  const unheart = () => {
    processUnheart(cardUsername);
    setClickedHeart(false);
    setBrokenHeart(`${heartClassName} fade-heart`);
  };

    // for the first render where clickedHeart and clickedMatch are updated before inLiked and inMatches are populated with alluser data
    useEffect(()=> {
      setClickedHeart(inLiked);
      setClickedMatch(inMatches);
    }, [inLiked, inMatches])

  return (
    <div className={`card detail-card ${basicClass}`}>
      {allInfo && allInfo[0] ? (
        <>
          {
            // showLikeIcon exists because the self view of a user's profile shouldn't have the like icon
            // in all cases but within the profile, showLikeIcon is true.
            showLikeIcon ? (
              <>
                {(clickedHeart || clickedMatch) ? (
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
              </>
            ) : null
          }

          {/* only include pfp on basic display  */}
          {cardType === "basic" ? (
            <>
              {/* default is just a profile pic icon, but if user has uploaded picture, they can use that */}
              {pfpSrc ? (
                <img
                  className="pfp center"
                  src={`data:${contentType};base64,${pfpSrc}`}
                />
              ) : (
                <AccountCircleIcon id="detail-pfp" />
              )}
            </>
          ) : null}

          <div className="details">
            <span className="bold-text">{allInfo[0]}</span>
            {/* basic, housing, and preference displays have two columns: labels and values. ex: age: 20 */}
            {cardType !== "extra" ? (
              <div className="two-cols">
                <div className="text-info label">
                  {labels.map((label, ix) => (
                    <span key={ix}>{label}: </span>
                  ))}
                </div>
                <div className="text-info value">
                  {allInfo.slice(1).map((info, ix) => (
                    <span key={ix}>{info}</span>
                  ))}
                </div>
              </div>
            ) : (
              // the "extra" card includes a biography, so no need to style for two columns of text.
              <div className="text-info bio">
                {allInfo.slice(1).map((info, ix) => (
                  <span key={ix}>{info}</span>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
