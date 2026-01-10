import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, FormGroup, Input, Label, Row, Spinner, Alert } from "reactstrap";
import { Btn, H4, H6, P } from "../AbstractElements";
import { countryCodes } from "../api/countryCode";
import { toast } from "react-toastify";
import axios from "axios";
import { sendSMS,verifyMobileReset } from "../api/Services";
import { FORGOT_PASSWORD_URL } from "../api";

const ForgetPwd = () => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  
  // Step tracking: 1 = mobile entry, 2 = OTP verification, 3 = password reset
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [errors, setErrors] = useState({});

  // OTP timer countdown
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateMobile = () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!validateMobile()) {
      return;
    }

    setIsLoading(true);
    try {
      // Verify mobile number exists in backend
      const verifyResponse = await verifyMobileReset(mobileNumber, countryCode);
      if (!verifyResponse.exists) {
        setErrors({ mobile: "Enter your login mobile number" });
        setIsLoading(false);
        return;
      }

      // Generate OTP (6 digits)
      const generatedOTP = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOtp(generatedOTP);

      // Send OTP via SMS
      await sendSMS('OTP_RESET', mobileNumber, generatedOTP);

      toast.success("OTP sent to your mobile number");
      setStep(2);
      setOtpTimer(600); // 10 minutes
      setErrors({});
      setOtp("");
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response?.data?.message) {
        setErrors({ mobile: error.response.data.message });
      } else {
        setErrors({ mobile: "Enter your login mobile number" });
      }
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    if (otpTimer === 0) {
      setErrors({ otp: "OTP has expired. Please request a new OTP" });
      return;
    }

    // Verify OTP matches
    if (parseInt(otp) !== generatedOtp) {
      setErrors({ otp: "Invalid OTP. Please try again" });
      return;
    }

    setErrors({});
    setStep(3);
    toast.success("OTP verified successfully");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const resetErrors = {};

    if (!newPassword) {
      resetErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      resetErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      resetErrors.confirmPassword = "Confirm password is required";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      resetErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(resetErrors).length > 0) {
      setErrors(resetErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(FORGOT_PASSWORD_URL, {
        mobile: mobileNumber,
        countryCode: countryCode,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });

      if (response.data.message === "Password reset successfully") {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      const errorMsg = error.response?.data?.message || "Failed to reset password";
      toast.error(errorMsg);
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const generatedOTP = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOtp(generatedOTP);
      await sendSMS('OTP_RESET', mobileNumber, generatedOTP);

      toast.success("OTP resent to your mobile number");
      setOtpTimer(600); // Reset timer to 10 minutes
      setOtp("");
      setErrors({});
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Fragment>
      <section>
        <Container className="p-0 login-page" fluid={true}>
          <Row className="m-0">
            <Col className="p-0">
              <div className="login-card">
                <div>
                  <div className="login-main">
                    <Form className="theme-form login-form" onSubmit={(e) => {
                      if (step === 1) handleSendOtp(e);
                      else if (step === 2) handleVerifyOtp(e);
                      else if (step === 3) handleResetPassword(e);
                    }}>
                      {/* Step 1: Mobile Number Entry */}
                      {step === 1 && (
                        <>
                          <H4>Reset Your Password</H4>
                          <P>Enter your mobile number to receive OTP</P>
                          
                          {errors.mobile && (
                            <Alert color="danger" className="mb-3">
                              {errors.mobile}
                            </Alert>
                          )}

                          <FormGroup>
                            <Label className="m-0 col-form-label">
                              Enter Your Mobile Number
                            </Label>
                            <Row>
                              <Col xs="4" sm="3">
                                <Input
                                  type="select"
                                  value={countryCode}
                                  onChange={(e) => setCountryCode(e.target.value)}
                                  style={{ maxWidth: "100%" }}
                                  disabled={isLoading}
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
                                  placeholder="Enter mobile number"
                                  value={mobileNumber}
                                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                  disabled={isLoading}
                                  maxLength="10"
                                />
                              </Col>
                            </Row>
                          </FormGroup>

                          <FormGroup>
                            <Btn
                              attrBtn={{
                                className: "btn d-block w-100",
                                color: "primary",
                                type: "submit",
                                disabled: isLoading || !mobileNumber,
                              }}
                            >
                              {isLoading ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Sending...
                                </>
                              ) : (
                                "Send OTP"
                              )}
                            </Btn>
                          </FormGroup>
                        </>
                      )}

                      {/* Step 2: OTP Verification */}
                      {step === 2 && (
                        <>
                          <H4>Verify OTP</H4>
                          <P>Enter the OTP sent to {countryCode} {mobileNumber}</P>

                          {errors.otp && (
                            <Alert color="danger" className="mb-3">
                              {errors.otp}
                            </Alert>
                          )}

                          <FormGroup>
                            <Label className="col-form-label m-0">
                              Enter OTP
                            </Label>
                            <Input
                              className="form-control"
                              type="tel"
                              placeholder="000000"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              disabled={isLoading}
                              maxLength="6"
                            />
                            <small className="text-muted mt-2">
                              Time remaining: {formatTime(otpTimer)}
                            </small>
                          </FormGroup>

                          <FormGroup>
                            <Btn
                              attrBtn={{
                                className: "btn d-block w-100",
                                color: "primary",
                                type: "submit",
                                disabled: isLoading || !otp || otpTimer === 0,
                              }}
                            >
                              {isLoading ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Verifying...
                                </>
                              ) : (
                                "Verify OTP"
                              )}
                            </Btn>
                          </FormGroup>

                          <P attrPara={{ className: "text-center text-muted" }}>
                            Didn't receive OTP?
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={isLoading || otpTimer > 0}
                              className="btn-link ms-2 border-0 bg-transparent"
                              style={{ cursor: otpTimer > 0 ? "not-allowed" : "pointer" }}
                            >
                              Resend
                            </button>
                          </P>

                          <P attrPara={{ className: "text-start mt-3" }}>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="btn-link border-0 bg-transparent"
                              style={{ cursor: "pointer" }}
                            >
                              Change mobile number
                            </button>
                          </P>
                        </>
                      )}

                      {/* Step 3: Password Reset */}
                      {step === 3 && (
                        <>
                          <H4>Reset Your Password</H4>
                          <P>Create your new password</P>

                          {errors.submit && (
                            <Alert color="danger" className="mb-3">
                              {errors.submit}
                            </Alert>
                          )}

                          <H6 attrH6={{ className: "mt-4 mb-3" }}>
                            Create Your Password
                          </H6>

                          <FormGroup className="position-relative">
                            <Label className="col-form-label m-0">
                              New Password
                            </Label>
                            <div className="position-relative">
                              <Input
                                className="form-control"
                                type={togglePassword ? "text" : "password"}
                                placeholder="*********"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isLoading}
                              />
                              <div
                                className="show-hide"
                                onClick={() => setTogglePassword(!togglePassword)}
                                style={{ cursor: "pointer" }}
                              >
                                <span className={togglePassword ? "" : "show"}></span>
                              </div>
                            </div>
                            {errors.newPassword && (
                              <small className="text-danger">{errors.newPassword}</small>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <Label className="col-form-label m-0">
                              Confirm Password
                            </Label>
                            <Input
                              className="form-control"
                              type="password"
                              placeholder="*********"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                              <small className="text-danger">{errors.confirmPassword}</small>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <Btn
                              attrBtn={{
                                color: "primary",
                                className: "btn d-block w-100",
                                type: "submit",
                                disabled: isLoading,
                              }}
                            >
                              {isLoading ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Updating...
                                </>
                              ) : (
                                "Update Password"
                              )}
                            </Btn>
                          </FormGroup>
                        </>
                      )}

                      <P attrPara={{ className: "text-start mt-3" }}>
                        Already have a password?
                        <Link className="ms-2" to={`/login`}>
                          Sign in
                        </Link>
                      </P>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default ForgetPwd;