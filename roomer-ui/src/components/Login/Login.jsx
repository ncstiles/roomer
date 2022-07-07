import * as React from "react";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Login() {
  const nav = useNavigate();
  let [validated, setValidated] = useState(false);
  let [signInForm, setSignInForm] = useState({ username: "", password: "" });
  let [successMsg, setSuccessMsg] = useState('hidden');
  // Checks that all required form inputs are entered
  // Updates `signInForm` state variable to reflect only the correctly submitted new inputs
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSuccessMsg('hidden')
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      event.preventDefault();
      event.stopPropagation();
      setSignInForm(
        (signInForm = {
          username: event.target.username.value,
          password: event.target.password.value,
        })
      );
      setSuccessMsg('success')
    }
  };

  return (
    <div className="login card">
      <h1 className="login-header">SIGN IN</h1>

      <Form
        noValidate
        validated={validated}
        onSubmit={(event) => handleSubmit(event)}>

        {/* username */}
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control required />
          <Form.Control.Feedback type="invalid">
            Please enter your username
          </Form.Control.Feedback>
        </Form.Group>
        
        {/* password */}
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required />
          <Form.Control.Feedback type="invalid">
            Please enter your password.
          </Form.Control.Feedback>
        </Form.Group>

        {/* remember me, forgot password */}
        <Row>
          <Col className="mb-3 center-text" xs={12} sm={6}>
            <Form.Group controlId="rememberMe">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
          </Col>

          <Col className="mb-3 center-text" xs={12} sm={6}>
            <Form.Group controlId="Forgot password?">
              <a href="#!">Forgot password?</a>
            </Form.Group>
          </Col>
        </Row>

        {/* submit */}
        <Button type="submit" className="login-submit mb-3">
          Sign in
        </Button>

        <p className={successMsg}>Login successful!</p>

        {/* not a member register */}
        <div className="redirect-register">
          <p>Not a member?</p>
          <p className="register-link" onClick={() => nav("/register")}>
            Register
          </p>
        </div>

        {/* sign up with social media */}
        <Row className="text-center">
          <p>Or sign up with:</p>
        </Row>
        <div className="text-center">
          <FacebookIcon className="social-icon" fontSize="large" />
          <InstagramIcon className="social-icon" fontSize="large" />
        </div>
      </Form>
    </div>
  );
}
