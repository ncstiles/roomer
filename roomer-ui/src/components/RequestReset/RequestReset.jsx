import * as React from "react";
import "./RequestReset.css";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { BASE_API_URL } from "../../constants";

export default function RequestReset() {
  const [validated, setValidated] = useState(false);
  let [username, setUsername] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    setShowMsg(false);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === true) {
      event.preventDefault();
      event.stopPropagation();
      setUsername((username = event.target.username.value));
      resetPassword();
    }
  };

  /**
   * Check if username is in database, and if so, send a confirmation email with a link 
   * to reset password.  
   */
  const resetPassword = () => {
    axios({
      method: "get",
      url: `${BASE_API_URL}/requestReset/${username}`,
    })
      .then((res) => {
        const isSuccess = res.data.requestStatus === "success" ? true : false;
        setSuccess(isSuccess);
      })
      .catch(() => {
        setSuccess(false);
      })
      .finally(() => {
        setUsername(null);
        setShowMsg(true);
      });
  };

  return (
    <div>
      <h1 className="tab-header">Request password reset</h1>
      <div className="reset-wrapper">
        <h1></h1>
        <Form
          noValidate
          validated={validated}
          onSubmit={(event) => handleSubmit(event)}
        >
          {/* username */}
          <Form.Group controlId="username" className="mb-3">
            <Form.Label className="reset-text">Enter your username</Form.Label>
            <Form.Control required onChange={()=> setShowMsg(false)}/>
            <Form.Control.Feedback type="invalid">
              Please enter your username
            </Form.Control.Feedback>
          </Form.Group>
          <Button size="lg" type="submit" className="mb-3">
            Reset password
          </Button>

          {showMsg ? (
            success ? (
              <p className="success">
                Check your email for a password reset link!
              </p>
            ) : (
              <p className="failure">
                Not a registered user. Please register first!
              </p>
            )
          ) : null}
        </Form>
      </div>
    </div>
  );
}
