import * as React from "react";
import "./UploadPfp.css";
import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import axios from "axios";

//DO NOT DELETE USERNAME AND SETISUPDATED NEED TO SET THESE IN THE AXIOS POST REQUEST
export default function UploadPfp({ username, setIsUpdated, avatarFile, setAvatarFile }) {
  let [toShow, setToShow] = useState(false);
  let [submitted, setSubmitted] = useState(false);
  let [curAvatarFile, setCurAvatarFile] = useState(null);
  
  // display the image file that was just uploaded
  const loadFile = (event) => {
    const image = document.getElementById("myAvatar");
    const avatar = event.target.files[0];
    image.src = URL.createObjectURL(avatar);
    setCurAvatarFile(avatar);
    setToShow(true);
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true); //TODO move this into the then when doing the axios request
    setAvatarFile(curAvatarFile);
  }

  return (
    <div className="update-card">
      <Form  onSubmit={(event) => handleSubmit(event)} enctype="multipart/form-data">
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
                name="image"
                onChange={(event) => loadFile(event)}
              />
            </Form.Group>
          </Col>
          <Col className="mb-3" sm={12} md={4}>
            <img id="myAvatar"/>
          </Col>
        </Row>
        
        {toShow ? (
          <>
            <Button className='form-submit submit-pfp' type="info" variant="secondary">
              Confirm as profile picture
            </Button>
            {
              submitted ? 
              <p className='success updated'>Congrats! Your profile picture has been updated.</p>
              :
              null
            }
          </>
          
        ) : null}
      </Form>
    </div>
  );
}
