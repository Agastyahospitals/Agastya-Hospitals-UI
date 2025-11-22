import React, { Fragment, useState } from "react";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Btn, H4, P, H6, Image } from "../AbstractElements";
import { Link, useNavigate } from "react-router-dom";
import { countryCodes } from "../api/countryCode";
import { toast } from "react-toastify";
import { registerUser } from "../api/Services";

const RegisterFrom = () => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      
      const payload = {
        userName:fullName,
        email,
        password,
        rawPassword: password,
        mobile: phone,
        whatsAppNumber: phone,
        isActive: true,
        roleID: 4,
        countryCode: countryCode,
        modules: ["5","14"],
      };

      const data = await registerUser(payload);
      toast.success(data.message || "User registered successfully");
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("userDetails", JSON.stringify(data.user));
      }

      // redirect to login after short delay (client-side navigation)
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Fragment>
      <div className="login-card">
        <div>
          <div className="login-main">
              <Form className="theme-form login-form" onSubmit={handleSubmit}>
              <H4>Create your account</H4>
              <P>Enter your personal details to create account</P>
              <FormGroup>
                <Label className="col-form-label m-0 pt-0">Your Name</Label>
                <Row className="g-2">
                  <Col xs="12">
                    <Input
                      className="form-control"
                      type="text"
                      required
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label className="col-form-label m-0 pt-0">Phone Number</Label>
                <Row className="g-2">
                  <Col xs="12">
                    <InputGroup>
                      <Input
                        type="select"
                        name="countryCode"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        style={{ maxWidth: "70px" }}
                        // className="form-select"
                      >
                        <option value="">Code</option>
                        {countryCodes.map((code) => (
                          <option value={code.dial_code} key={code.code}>
                            {code.dial_code}
                          </option>
                        ))}
                      </Input>
                      <Input
                        className="form-control"
                        type="text"
                        required
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label className="col-form-label m-0 pt-0">Email Address</Label>
                <Input
                  className="form-control"
                  type="email"
                  required
                  placeholder="Test@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="position-relative">
                <Label className="col-form-label m-0 pt-0">Enter Password</Label>
                <div className="position-relative">
                  <Input
                    className="form-control"
                    type={togglePassword ? "text" : "password"}
                    name="login[password]"
                    required
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="show-hide"
                    onClick={() => setTogglePassword(!togglePassword)}
                  >
                    <span className={togglePassword ? "" : "show"}></span>
                  </div>
                </div>
              </FormGroup>
              <FormGroup className="position-relative">
                <Label className="col-form-label m-0 pt-0">Confirm Password</Label>
                <div className="position-relative">
                  <Input
                    className="form-control"
                    type={togglePassword ? "text" : "password"}
                    name="login[password]"
                    required
                    placeholder="*********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div
                    className="show-hide"
                    onClick={() => setTogglePassword(!togglePassword)}
                  >
                    <span className={togglePassword ? "" : "show"}></span>
                  </div>
                </div>
              </FormGroup>
              <FormGroup>
                <Btn
                  attrBtn={{
                    className: "d-block w-100",
                    color: "primary",
                    type: "submit",
                    disabled: isSubmitting,
                    onClick: handleSubmit,
                  }}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Btn>
              </FormGroup>

              <P attrPara={{ className: "mb-0 text-start" }}>
                Already have an account?
                <Link className="ms-2" to={`/login`}>
                  Sign in
                </Link>
              </P>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RegisterFrom;
