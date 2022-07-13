import * as React from "react";
import "./UploadPfp.css";
import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { BASE_API_URL } from "../../constants";
import axios from "axios";

export default function UploadPfp({ username, setIsUpdated, setAvatarFile }) {
  let [toShow, setToShow] = useState(false);
  let [submitted, setSubmitted] = useState(false);
  let [curAvatarFile, setCurAvatarFile] = useState(null);

  // display the image file that was just uploaded
  const loadFile = (event) => {
    const image = document.getElementById("pfpPreview");
    const avatar = event.target.files[0];
    image.src = URL.createObjectURL(avatar);
    setCurAvatarFile(avatar);
    setToShow(true);
    setSubmitted(false);
  };

  /**
   * Execute POST request containing image and username
   * If successful, update the profile picture in the profile section
   * and rerender the gridview.
   *
   * @param {*} event the click "confirming" a profile pic choice
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("pfpSrc", curAvatarFile);
    formData.append("username", username);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(BASE_API_URL + "/uploadPfp", formData, config)
      .then((res) => {
        setAvatarFile(curAvatarFile);
        setIsUpdated((prevVal) => !prevVal);
        setSubmitted(true);
      })
      .catch((e) => {
      });
  };

  return (
    <div className="update-card">
      <Form onSubmit={(event) => handleSubmit(event)}>
        <h2 className="upload-header">Upload a profile picture</h2>
        <Row>
          <Col className="mb-3 upload" sm={12} md={4}>
            <Form.Group controlId="formFile">
              <Form.Label>Upload your profile picture</Form.Label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                accept="image/*"
                name="pfpSrc"
                onChange={(event) => loadFile(event)}
              />
            </Form.Group>
          </Col>
          <Col className="mb-3" sm={12} md={4}>
            <img className="pfp-preview" id="pfpPreview" />
          </Col>
        </Row>

        {toShow ? (
          <>
            <Button
              className="form-submit submit-pfp"
              type="info"
              variant="secondary"
            >
              Confirm as profile picture
            </Button>
            {submitted ? (
              <p className="success updated">
                Congrats! Your profile picture has been updated.
              </p>
            ) : null}
          </>
        ) : null}
      </Form>
    </div>
  );
}
