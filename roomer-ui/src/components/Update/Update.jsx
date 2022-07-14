import * as React from "react";
import "./Update.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL, updateFormKeys } from "../../constants";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function Update({ username, setIsUpdated }) {
  const nav = useNavigate();
  let [successMsg, setSuccessMsg] = useState("hidden");

  const handleSubmit = (event) => {
    const updateForm = {};
    event.preventDefault();

    //only add to the update form values that the user has changed (non-empty)
    for (let i = 0; i < updateFormKeys.length; i++) {
      const curKey = updateFormKeys[i];
      const curVal = event.target[i].value;
      if (curVal !== "" && curVal !== " ") {
        updateForm[curKey] = curVal;
      }
    }
    updateInfo(updateForm);
    setSuccessMsg("success");
  };

  /**
   * Update a user `username` with their newly inputted preferences/data
   *
   * @param {Object} updateForm a form containing the values the user just submitted for update
   */
  const updateInfo = (updateForm) => {
    axios
      .post(BASE_API_URL + "/update/" + username, { updateForm })
      .then((res) => {
        setIsUpdated((prevVal) => !prevVal);
      });
  };

  return (
    <div className="update" id="register-component">
      <h1 className="register-header">UPDATE YOUR INFO</h1>

      <Form onSubmit={(event) => handleSubmit(event)}>
        <div className="update-card">
          <Row>
            <h2 className="update-header">Account Info</h2>
          </Row>

          <Row>
            {/* first name */}
            <Col md={12} lg={6} className="mb-3">
              <Form.Group controlId="firstName">
                <Form.Label>First name</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
            {/* last name */}
            <Col md={12} lg={6} className="mb-3">
              <Form.Group controlId="lastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* email */}
            <Col sm={12} lg={6} className="mb-3">
              <Form.Group className="mb-3" as={Col} controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>

            {/* password */}
            <Col xs={12} sm={6} className="mb-3">
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="update-card">
          <Row>
            <h2 className="update-header">Profile</h2>
          </Row>

          <Row>
            {/* age */}
            <Col className="mb-3" sm={12} md={6}>
              <Form.Group controlId="age">
                <Form.Label>Age</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
            {/* gender */}
            <Col className="mb-3" sm={12} md={6}>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Select>
                  <option> </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* occupation */}
            <Col className="mb-3" sm={12} md={6}>
              <Form.Group controlId="occupation">
                <Form.Label>Occupation</Form.Label>
                <Form.Select>
                  <option> </option>
                  <option value="High school student">
                    High school student
                  </option>
                  <option value="College student">College student</option>
                  <option value="Postgrad">Postgrad</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* profession */}
            <Col className="mb-3" sm={12} md={6}>
              <Form.Group controlId="profession">
                <Form.Label>Profession, e.g. designer </Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="update-card">
          {/* bio + instagram handle */}
          <Row>
            <h2 className="update-header">Extra</h2>
          </Row>

          <Row>
            {/* Insta handle */}
            <Form.Group className="mb-3" as={Col} controlId="insta">
              <Form.Label>Instagram handle</Form.Label>
              <Form.Control />
            </Form.Group>
            {/* Fb handle */}
            <Form.Group className="mb-3" as={Col} controlId="fb">
              <Form.Label>Facebook handle</Form.Label>
              <Form.Control />
            </Form.Group>
          </Row>
          {/* short bio */}
          <Form.Group className="mb-3 bio">
            <Form.Label>Short Bio</Form.Label>
            <textarea id="bio" className="form-control" rows="3" />
          </Form.Group>
        </div>

        <div className="update-card">
          <Row>
            <h2 className="update-header">Housing</h2>
          </Row>
          <Row>
            {/* rent price */}
            <Col className="mb-3" sm={12} md={4}>
              <Form.Group controlId="rentRange">
                <Form.Label>Rent/mo</Form.Label>
                <Form.Select>
                  <option> </option>
                  <option value="<$500">&#60;$500</option>
                  <option value="$500 - $1000">$500 - $1,000</option>
                  <option value="$1,000 - $2,000">$1,000 - $2,000</option>
                  <option value="$2,000 - $3,000">$2,000 - $3,000</option>
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="$5,000+">$5,000+</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* addr */}
            <Col className="mb-3" sm={12} md={8}>
              <Form.Group className="mb-3" controlId="addr">
                <Form.Label>
                  {" "}
                  Rooming Address (optional, only if known)
                </Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* state */}
            <Col className="mb-3" sm={12} md={4}>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
            {/* city */}
            <Col className="mb-3" sm={6} md={4}>
              <Form.Group controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
            {/* zip */}
            <Col className="mb-3" sm={6} md={4}>
              <Form.Group controlId="zip">
                <Form.Label>Zip</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className="update-card">
          <Row>
            <h2 className="update-header">Detailed preferences</h2>
          </Row>
          <Row>
            {/* age preference */}
            <Col className="mb-3" sm={12} md={4}>
              <Form.Group controlId="agePref">
                <Form.Label>Age preference</Form.Label>
                <Form.Select>
                  <option> </option>
                  <option value="<18">&#60;18</option>
                  <option value="18-22">18-22</option>
                  <option value="23-26">23-26</option>
                  <option value="27-35">27-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51-65">51-65</option>
                  <option value="66+">66+</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* gender preference */}
            <Col className="mb-3" sm={12} md={4}>
              <Form.Group controlId="genderPref">
                <Form.Label>Gender preference</Form.Label>
                <Form.Select>
                  <option> </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* location preference */}
            <Col className="mb-3" sm={12} md={4}>
              <Form.Group controlId="locRad">
                <Form.Label>Location radius</Form.Label>
                <Form.Select>
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

          <Row>
            {/* age importance */}
            <Col className="mb-3" sm={12} md={4}>
              <Form.Group controlId="ageWeight">
                <Form.Label>
                  Age importance (1 = not at all, 5 = very much)
                </Form.Label>
                <Form.Select>
                  <option> </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a valid roommate age preference.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            {/* gender importance */}
            <Col className="mb-3" sm={12} md={4}>
              <Form.Group controlId="genderWeight">
                <Form.Label>
                  Gender importance (1 = not at all, 5 = very much)
                </Form.Label>
                <Form.Select>
                  <option> </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a valid roommate age preference.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            {/* location importance */}
            <Col className="mb-3" sm={12} md={4}>
              <Form.Group controlId="locWeight">
                <Form.Label>
                  Location importance (1 = not at all, 5 = very much)
                </Form.Label>
                <Form.Select>
                  <option> </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a valid roommate age preference.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </div>
        {/* update button */}
        <div className="update-wrapper">
          <Button type="info" variant="secondary" className="form-submit mb-3">
            Update
          </Button>
        </div>
        {/* update success message */}
        <p className={successMsg}>Your information has been updated!</p>
      </Form>
    </div>
  );
}
