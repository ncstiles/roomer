import * as React from "react";
import "./DetailCard.css";
import "../../css/card.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// DetailCard has 4 views: basic, housing, preferences, and extra info.
// Only the basic view includes a profile picture, so there is a unique className `card-two-rows` to account for its styling.
// All classes but extra info have two columns of text, so there is a unique className `two-cols` to account for their styling.
export default function DetailCard({ cardType, labels, allInfo }) {
  // basic card includes pfp, so we need two "rows" of content on the card.
  // toggle className appropriately
  const basicClass = cardType === "basic" ? "card-two-rows" : "card-one-row";
  return (
    <div className={`card detail-card ${basicClass}`}>
      {allInfo && allInfo[0] ? (
        <>
          {/* only include pfp on basic display  */}
          {cardType === "basic" ? (
            <AccountCircleIcon className="detail-pfp" />
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
              <div className="text-info value">
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
