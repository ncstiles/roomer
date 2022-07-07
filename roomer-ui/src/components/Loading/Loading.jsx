import * as React from "react";
import "./Loading.css";
import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <div className="spinning">
      <h1>LOADING</h1>
      <Spinner animation="border" variant="secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
