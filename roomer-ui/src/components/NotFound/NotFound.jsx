import * as React from "react";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found-text">
        Oops - this user wasn't found in our database. Please modify your
        search, filter on a different category, or access a different endpoint.
      </h1>
    </div>
  );
}
