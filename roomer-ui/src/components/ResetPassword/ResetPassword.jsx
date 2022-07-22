import * as React from "react";
import "./ResetPassword.css";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { BASE_API_URL } from "../../constants";

export default function ResetPassword() {
  const [validated, setValidated] = useState(false);
  let [password, setPassword] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [success, setSuccess] = useState(false);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const username = urlParams.get("username");
  const token = urlParams.get("token");

  const handleSubmit = (event) => {
    setShowMsg(false);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === true) {
      event.preventDefault();
      event.stopPropagation();
      setPassword((password = event.target.password.value));
      resetPassword();
    }
  };

  /**
   * Check if user exists in database and if token matches.  If so reset password and send
   * confirmation email.
   */
  const resetPassword = () => {
    axios
      .post(BASE_API_URL + "/resetPassword", { username, token, password })
      .then((res) => {
        const isSuccess = res.data.resetStatus === "success" ? true : false;
        setSuccess(isSuccess);
      })
      .catch((e) => {
        setSuccess(false);

      })
      .finally(() => {
        setPassword(null);
        setShowMsg(true);
      });
  };

  return (
    <div>
      <h1 className="tab-header">Confirmation new password</h1>
      <div className="reset-wrapper">
        <h1></h1>
        <Form
          noValidate
          validated={validated}
          onSubmit={(event) => handleSubmit(event)}
        >
          {/* password */}
          <Form.Group controlId="password" className="mb-3">
            <Form.Label className="reset-text">
              Enter your new password
            </Form.Label>
            <Form.Control type="password" required onChange={()=> setShowMsg(false)}/>
            <Form.Control.Feedback type="invalid">
              Please enter your new password
            </Form.Control.Feedback>
          </Form.Group>
          <Button size="lg" type="submit" className="mb-3">
            Confirm
          </Button>

          {showMsg ? (
            success ? (
              <p className="success">Password updated!</p>
            ) : (
              <p className="failure">Error updating password</p>
            )
          ) : null}
        </Form>
      </div>
    </div>
  );
}
