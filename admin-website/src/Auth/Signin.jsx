import React, { Fragment, useState, useEffect } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Btn, H4, P } from "../AbstractElements";
import {
  ForgotPassword,
  Password,
  SignIn,
} from "../Constant";
import { countryCodes } from "../api/countryCode";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import OtherWay from "./OtherWay";
import { ToastContainer, toast } from "react-toastify";
import { loginAsync, clearError } from "../slices/authSlice";
import { getRoleId } from '../utils';

const Signin = ({ selected }) => {
  const [loginInput, setLoginInput] = useState(""); // Can be email or mobile
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [loginType, setLoginType] = useState("mobile"); // "mobile" or "email"
  const history = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const toasterConfig = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      toasterConfig("success", "Successfully logged in!..");
      localStorage.setItem("login", JSON.stringify(true));
      const roleid = getRoleId();
      const allowedRoles = [1, 2, 3];
      const redirectPath = allowedRoles.includes(roleid) ? '/dashboard' : '/appointments';
      history(redirectPath);
    }
  }, [isAuthenticated, history]);

  // Handle authentication error with SweetAlert
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loginAuth = async (e) => {
    e.preventDefault();

    if (!loginInput || !password) {
      toasterConfig("error", "Please enter your credentials");
      return;
    }

    if (loginType === "mobile" && loginInput.length !== 10) {
      toasterConfig("error", "Please enter a valid 10-digit mobile number");
      return;
    }

    if (loginType === "email" && !loginInput.includes("@")) {
      toasterConfig("error", "Please enter a valid email address");
      return;
    }

    // Clear any previous errors
    dispatch(clearError());

    // Prepare credentials based on login type
    let credentials = { password };
    if (loginType === "mobile") {
      credentials = { ...credentials, mobile: loginInput, countryCode };
    } else {
      credentials = { ...credentials, email: loginInput };
    }

    // Dispatch the login action
    const result = await dispatch(loginAsync(credentials));

    // If login failed, the error will be handled by the useEffect above
    if (loginAsync.rejected.match(result)) {
      toasterConfig(
        "error",
        "Please check your credentials and try again!"
      );
      return;
    }
  };

  return (
    <Fragment>
      <Container fluid={true} className="p-0 login-page">
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form">
                  <H4>Sign In With Agastya Hospitals</H4>
                  <P>{loginType === "mobile" ? "Enter your mobile number & password to login" : "Enter your email & password to login"}</P>
                  
                  {/* Login Type Toggle */}
                  <FormGroup className="mb-3">
                    <div className="d-flex gap-3">
                      <Label className="mb-0">
                        <Input
                          type="radio"
                          name="loginType"
                          value="mobile"
                          checked={loginType === "mobile"}
                          onChange={(e) => {
                            setLoginType(e.target.value);
                            setLoginInput("");
                          }}
                          disabled={loading}
                        />
                        {" "} Login with Mobile
                      </Label>
                      <Label className="mb-0">
                        <Input
                          type="radio"
                          name="loginType"
                          value="email"
                          checked={loginType === "email"}
                          onChange={(e) => {
                            setLoginType(e.target.value);
                            setLoginInput("");
                          }}
                          disabled={loading}
                        />
                        {" "} Login with Email
                      </Label>
                    </div>
                  </FormGroup>

                  {/* Mobile Login */}
                  {loginType === "mobile" && (
                    <FormGroup>
                      <Label className="col-form-label">Mobile Number</Label>
                      <Row className="g-2">
                        <Col xs="4" sm="3">
                          <Input
                            type="select"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            disabled={loading}
                            className="form-control"
                          >
                            <option value="">Code</option>
                            {countryCodes.map((code) => (
                              <option value={code.dial_code} key={code.code}>
                                {code.dial_code}
                              </option>
                            ))}
                          </Input>
                        </Col>
                        <Col xs="8" sm="9">
                          <Input
                            className="form-control"
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setLoginInput(value);
                            }}
                            value={loginInput}
                            disabled={loading}
                            maxLength="10"
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  )}

                  {/* Email Login */}
                  {loginType === "email" && (
                    <FormGroup>
                      <Label className="col-form-label">Email Address</Label>
                      <Input
                        className="form-control"
                        type="email"
                        placeholder="Enter your email address"
                        onChange={(e) => setLoginInput(e.target.value)}
                        value={loginInput}
                        disabled={loading}
                      />
                    </FormGroup>
                  )}
                  <FormGroup className="position-relative">
                    <Label className="col-form-label">{Password}</Label>
                    <div className="position-relative">
                      <Input
                        className="form-control"
                        type={togglePassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        disabled={loading}
                      />
                      <div
                        className="show-hide"
                        onClick={() => setTogglePassword(!togglePassword)}
                      >
                        <span className={togglePassword ? "" : "show"}></span>
                      </div>
                    </div>
                  </FormGroup>
                  <div className="position-relative text-right">
                    <Link to={"/forget-pwd"}>{ForgotPassword}</Link>
                    <Btn
                      attrBtn={{
                        color: "primary",
                        className: "d-block w-100 mt-2",
                        onClick: (e) => loginAuth(e),
                        disabled: loading,
                      }}
                    >
                      {loading ? "Signing in..." : SignIn}
                    </Btn>
                  </div>
                  <OtherWay />
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default Signin;
