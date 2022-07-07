import * as React from "react";
import "./Register.css";
import axios from "axios";
import { useState } from "react";
import { BASE_API_URL } from "../../constants";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function Register({ registerForm, setRegisterForm }) {
  let [validated, setValidated] = useState(false);
  const regFormKeys = Object.keys(registerForm);
  let [successMsg, setSuccessMsg] = useState('hidden')

  // Check all required form fields are correctly filled out
  // If all required fields filled, update the `registerForm` state variable to reflect the new inputs
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

      for (let i = 0; i < regFormKeys.length; i++) {
        const curKey = regFormKeys[i];
        const curVal = event.target[i].value;
        setRegisterForm((registerForm = { ...registerForm, [curKey]: curVal }));
      }
      postRegisterForm();
      setSuccessMsg('success')
    }
  };

  // PosPOSTt request to send the updated registration form contents to the database
  let postRegisterForm = () => {
    axios
      .post(BASE_API_URL + "/register", {
        registerForm,
      })
  };

  return (
    <div className="register card">
      <h1 className="register-header">CREATE AN ACCOUNT</h1>

      <Form
        noValidate
        validated={validated}
        onSubmit={(event) => handleSubmit(event)}>

        <Row>
          <h2>Register</h2>
        </Row>

        <Row>
          {/* first name */}
          <Col md={12} lg={6} className="mb-3">
            <Form.Group controlId="firstName">
              <Form.Label>First name</Form.Label>
              <Form.Control required />
              <Form.Control.Feedback type="invalid">
                Please enter your first name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* last name */}
          <Col md={12} lg={6} className="mb-3">
            <Form.Group controlId="lastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control required />
              <Form.Control.Feedback type="invalid">
                Please enter your last name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* username */}
          <Col sm={12} lg={6} className="mb-3">
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control required />
              <Form.Control.Feedback type="invalid">
                Please enter a username.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* email */}
          <Col sm={12} lg={6} className="mb-3">
            <Form.Group className="mb-3" as={Col} controlId="email">
              <Form.Label>Email (optional)</Form.Label>
              <Form.Control />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* password */}
          <Col xs={12} sm={6} className="mb-3">
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required />
              <Form.Control.Feedback type="invalid">
                Please enter a password.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <h2>Basic info</h2>
        </Row>

        <Row>
          {/* age */}
          <Col className="mb-3" xs={12} sm={4}>
            <Form.Group controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control.Feedback type="invalid">
                Please enter your age.
              </Form.Control.Feedback>
              <Form.Control required />
            </Form.Group>
          </Col>
          {/* gender */}
          <Col className="mb-3" xs={12} sm={4}>
            <Form.Group controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Select aria-label="Select gender" required>
                <option> </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please enter your gender.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* rent price */}
          <Col className="mb-3" xs={12} sm={4}>
            <Form.Group controlId="rentRange">
              <Form.Label>Rent/mo</Form.Label>
              <Form.Select aria-label="Select rent range" required>
                <option> </option>
                <option value="<$500">&#60;$500</option>
                <option value="$500 - $1000">$500 - $1,000</option>
                <option value="$1,000 - $2,000">$1,000 - $2,000</option>
                <option value="$2,000 - $3,000">$2,000 - $3,000</option>
                <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                <option value="$5,000+">$5,000+</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a valid rent range.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* occupation */}
          <Col className="mb-3" xs={12} sm={6}>
            <Form.Group controlId="occupation">
              <Form.Label>Occupation</Form.Label>
              <Form.Select aria-label="Default select example" required>
                <option> </option>
                <option value="High school student">High school student</option>
                <option value="College student">College student</option>
                <option value="Postgrad">Postgrad</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a valid occupation.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* profession */}
          <Col className="mb-3" xs={12} sm={6}>
            <Form.Group controlId="profession">
              <Form.Label>Profession, e.g. designer (optional)</Form.Label>
              <Form.Control />
            </Form.Group>
          </Col>
        </Row>

        {/* addr */}
        <Form.Group className="mb-3" controlId="addr">
          <Form.Label> Rooming Address (optional, only if known)</Form.Label>
          <Form.Control />
        </Form.Group>

        <Row>
          {/* state */}
          <Col className="mb-3" xs={12} sm={4}>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control required />
              <Form.Control.Feedback type="invalid">
                Please enter the city you intend to room in.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* city */}
          <Col className="mb-3" xs={6} sm={4}>
            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control required />
              <Form.Control.Feedback type="invalid">
                Please enter the state you intend to room in.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* zip */}
          <Col className="mb-3" xs={6} sm={4}>
            <Form.Group controlId="zip">
              <Form.Label>Zip</Form.Label>
              <Form.Control />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <h2>Preference</h2>
        </Row>

        <Row>
          {/* age preference */}
          <Col className="mb-3" xs={12} sm={4}>
            <Form.Group controlId="agePref">
              <Form.Label>Age preference</Form.Label>
              <Form.Select aria-label="Default select example" required>
                <option> </option>
                <option value="<18">&#60;18</option>
                <option value="18-22">18-22</option>
                <option value="23-26">23-26</option>
                <option value="27-35">27-35</option>
                <option value="36-50">36-50</option>
                <option value="51-65">51-65</option>
                <option value="66+">66+</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a valid roommate age preference.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* gender preference */}
          <Col className="mb-3" xs={12} sm={4}>
            <Form.Group controlId="genderPref">
              <Form.Label>Gender preference</Form.Label>
              <Form.Select aria-label="Default select example" required>
                <option> </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a roommate gender preference.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* location preference */}
          <Col className="mb-3" xs={12} sm={4}>
            <Form.Group controlId="locRad">
              <Form.Label>Location radius</Form.Label>
              <Form.Select aria-label="Default select example" required>
                <option> </option>
                <option value="<5 mi">&#60;5 mi</option>
                <option value="6-10 mi">6-10 mi</option>
                <option value="11-15 mi">11-15 mi</option>
                <option value="16-25 mi">16-25 mi</option>
                <option value="26-40 mi">26-40 mi</option>
                <option value="40-80 mi">40-80 mi</option>
                <option value="80+ mi">80+ mi</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select the largest acceptable location radius.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* bio + instagram handle */}
        <Row>
          <h2>Extra</h2>
        </Row>

        <Row>
          {/* Insta handle */}
          <Form.Group className="mb-3" as={Col} controlId="insta">
            <Form.Label>Instagram handle (optional)</Form.Label>
            <Form.Control />
          </Form.Group>
          {/* Fb handle */}
          <Form.Group className="mb-3" as={Col} controlId="fb">
            <Form.Label>Facebook handle (optional)</Form.Label>
            <Form.Control />
          </Form.Group>
        </Row>
        {/* short bio */}
        <Form.Group className="mb-3 bio">
          <Form.Label>Short Bio</Form.Label>
          <textarea id="bio" className="form-control" rows="3" required />
          <Form.Control.Feedback type="invalid">
            Please enter a short bio.
          </Form.Control.Feedback>
        </Form.Group>

        {/* terms and conditions */}
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="I agree to Terms and Conditions"
            required
          />
        </Form.Group>

        {/* submit */}
        <Button type="info" className="form-submit mb-3">
          Submit
        </Button>

        <p className={successMsg}> Congratulations! You're now registered for an account.</p>
      </Form>
    </div>
  );
}
