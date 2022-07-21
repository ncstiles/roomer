import * as React from "react";
import "./ResetPassword.css";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { BASE_API_URL } from "../../constants";

export default function ResetPassword() {
  const [validated, setValidated] = useState(false);
  let [username, setUsername] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  const handleSubmit = (event) => {
    console.log('within handle submit')
    const form = event.currentTarget;
    if (form.checkValidity() === false){
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      event.preventDefault();
      event.stopPropagation();
      setUsername(event.target.username.value);
      resetPassword();
    }
  };

  const resetPassword = () => {
    axios({
      method: "get",
      url: `${BASE_API_URL}/resetPassword/${username}`,
    })
      .then((res) => {
        showMsg(true);
      })
      .catch((e) => {
        showMsg(false);
      })
  };

  console.log("inside reset password");
  return (
    <div>
      <h1 className="tab-header">Reset your password</h1>
      <div className="reset-wrapper">
            <h1></h1>
            <Form
              noValidate
              validated={validated}
              onSubmit={(event) => handleSubmit(event)}>
              {/* username */}
              <Form.Group controlId="username" className="mb-3">
                <Form.Label className="reset-text">
                  Enter your username
                </Form.Label>
                <Form.Control required/>
                <Form.Control.Feedback type="invalid">
                  Please enter your username
                </Form.Control.Feedback>
              </Form.Group>
              <Button size="lg" type="submit" className="mb-3">
                Reset password
              </Button>

                {showMsg 
                ? 
                <p className="success">Check your email for a password reset link!</p>
                :
                <p className="reset-text">Not a registered user.  Please register first!</p>
                }
            </Form>
      </div>
    </div>
  );
}