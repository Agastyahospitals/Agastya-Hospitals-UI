import React, { useState } from "react";
import { toasterConfig } from "../../utils";
import { useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const initialState = {
  fullName: "",
  mobile: "",
  email: "",
  message: "",
  "h-captcha-response": ""
};

const ContactUs = () => {

  const captchaRef = useRef();
  const [formState, setFormState] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(false);

  const validate = () => {
    if (!formState.fullName) {
      return "Full name is required";
    }
    if (!formState.mobile) {
      return "Mobile number is required";
    }
    if (!formState.email) {
      return "Email is required";
    }
    if (!formState.message) {
      return "Message is required";
    }
    if (!formState["h-captcha-response"]) {
      return "Captcha is required";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
    setSubmitted(false);
    setResult(false);
    captchaRef.current.resetCaptcha();
  };

  const onHCaptchaChange = (token) => {
    setFormState((prev) => ({
      ...prev,
      "h-captcha-response": token
    }));
  };

  const handleHCaptchaError = () => {
    setFormState((prev) => ({
      ...prev,
      "h-captcha-response": ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      setResult(false);
      const formData = new FormData(e.target);
      formData.append("access_key", "09952932-0e2d-40a1-8514-31fdc2bd87ff");
      // formData.append("contactForm", "Contact Form");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        toasterConfig("success", "Enquiry submitted successfully, we will get back to you soon!");
        captchaRef.current.resetCaptcha();
        resetForm();
      } else {
        setSubmitted(false);
        toasterConfig("error", "Failed to submit enquiry, please try again!");
        resetForm();
      }
    }
  };

  const isFormInvalid = () => {
    const requiredFields = ["fullName", "mobile", "email", "message", "h-captcha-response"];
    return requiredFields.some(
      (field) =>
        formState[field] === null ||
        formState[field] === undefined ||
        formState[field] === "" ||
        (typeof formState[field] === "boolean" && formState[field] === false)
    );
  };

  return (
    <div>
      <div className="container p-5">
        <div className="row">
          <div className="col-lg-4">
            <aside className="contact-sidebar">
              <div className="contact-location-box">
                <h4 className="title">Location:</h4>
                <p className="infotext">
                 #102, 103, Omkar Nagar, Nagarjuna Sagar Road, LB Nagar, Hyderabad, Telangana - 500079, India.
                </p>
              </div>

              <div className="contact-location-box">
                <h4 className="title">Call us:</h4>
                <p className="infotext">040 - 65 108 108</p>
                <p className="infotext">+91 9459 108 108</p>
              </div>

              <div className="contact-location-box">
                <h4 className="title">Write to us:</h4>
                <p className="infotext">
                  <a href="mailto:info@agastyahospitals.com">info@agastyahospitals.com</a>
                </p>
                
              </div>
            </aside>
          </div>
          <div className="col-lg-8">
            <div className="contact-form-container">
              <h2 className="contact-form-title">
                Fill the Form, Will get back to you soon
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <input type="hidden" name="contactForm" value="Contact Form" id="contactForm" className="contact-form-input" />
                  <div className="contact-form-group">
                    <label htmlFor="fullName" className="contact-form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="contact-form-input"
                      value={formState.fullName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="mobile" className="contact-form-label">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      className="contact-form-input"
                      value={formState.mobile}
                      onChange={handleChange}
                      maxLength={10}
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="email" className="contact-form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="contact-form-input"
                      value={formState.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="message" className="contact-form-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="contact-form-textarea"
                      value={formState.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center mb-3">
                  <HCaptcha
                    sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                    reCaptchaCompat={false}
                    onVerify={onHCaptchaChange}
                    ref={captchaRef}
                  />
                </div>

                <button type="submit" className={!isFormInvalid() ? "contact-form-btn-submit" : "contact-form-btn-submit disabled opacity-50"} disabled={isFormInvalid()}>
                  {submitted && <span className="spinner-border spinner-border-sm me-2" />}
                  {submitted ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
