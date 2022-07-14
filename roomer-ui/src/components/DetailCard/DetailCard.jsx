import * as React from "react";
import "./DetailCard.css";
import "../../css/card.css";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
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
  addLike,
  removeLike,
}) {
  // basic card includes pfp, so we need two "rows" of content on the card.
  // toggle className appropriately
  const basicClass = cardType === "basic" ? "card-two-rows" : "card-one-row";
  let [clickedLike, setClickedLike] = useState(false);
  
  const like = () => {
    addLike(cardUsername);
    setClickedLike(true);
  };

  const unlike = () => {
    removeLike(cardUsername);
    setClickedLike(false);
  };
  return (
    <div className={`card detail-card ${basicClass}`}>
      {allInfo && allInfo[0] ? (
        <>
          {
            // showLikeIcon exists because the self view of a user's profile shouldn't have the like icon
            // in all cases but within the profile, showLikeIcon is true.
            showLikeIcon ? (
              <>
                {clickedLike ? (
                  <FavoriteIcon className="heart" onClick={unlike} />
                ) : (
                  <FavoriteBorderOutlinedIcon
                    className="heart"
                    onClick={like}
                  />
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
