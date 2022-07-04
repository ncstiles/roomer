import * as React from "react";
import "./DetailCard.css";
import "../../css/card.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function DetailCard({ cardId, cardType, labels, allInfo }) {
  // basic card display has two rows to include the pfp,
  // while extended and optional display have 1 row of content
  const basicClass = cardType === "basic" ? "basic" : "non-basic";
  return (
    <div className={`card detail-card ${basicClass}`}>
      {allInfo && allInfo[0] ? (
        <>
          {/* only include pfp on basic display  */}
          {cardType === "basic" ? (
            <AccountCircleIcon className="detail-pfp" />
          ) : null}

          <div className="details">
            {/* name is included in all displays, put in bold text as well */}
            <span className="bold-text name">{allInfo[0]}</span>
            {/* basic/ extended displays have two columns: labels and values. ex: age: 20 */} 
            {cardType !== "optional" ? (
              <div className="descriptions">
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
              // Optional display includes short biography, so no columns of text exist
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
