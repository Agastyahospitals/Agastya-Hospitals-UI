import HCaptcha from "@hcaptcha/react-hcaptcha";
import React, { useState } from "react";
import { toasterConfig } from "../utils";
import { useRef } from "react";
import { countryCodes } from "../api/countryCode";

const initialState = {
  fullName: "",
  email: "",
  mobileNumber: "",
  countryCode: "+91",
  message: "",
  agreePolicy: false,
  isWhatsApp: false,
  "h-captcha-response": ""
};

const EnquiryForm = ({ formType = "Enquiry Form", enquiryFormTitle = "" }) => {
  const [formState, setFormState] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(false);
  const captchaRef = useRef(null);


  const validate = () => {
    const newErrors = {};
    if (!formState.fullName) newErrors.name = "Name is required";
    if (!formState.email) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formState.email))
      newErrors.email = "Enter a valid email address";
    if (!formState.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10}$/.test(formState.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit phone number";
    if (!formState.message) newErrors.message = "Please describe your case";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onHCaptchaChange = (token) => {
    setFormState((prev) => ({
      ...prev,
      "h-captcha-response": token
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      setResult(false);
      const formData = new FormData(e.target);
      formData.append("access_key", "6fddfe28-f710-4cc1-80d0-7744a598e8bd");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        toasterConfig("success", "Enquiry submitted successfully, we will get back to you soon!");
        setFormState(initialState);
        captchaRef.current.resetCaptcha();
      } else {
        setSubmitted(false);
        toasterConfig("error", "Failed to submit enquiry, please try again!");
        setFormState(initialState);
      }
    }
  };

  const isFormInvalid = () => {
    const requiredFields = ["fullName", "mobileNumber", "email", "agreePolicy"];
    return requiredFields.some(
      (field) =>
        formState[field] === null ||
        formState[field] === undefined ||
        formState[field] === "" ||
        (typeof formState[field] === "boolean" && formState[field] === false)
    );
  };
  return (
    <form onSubmit={handleSubmit} className="booking-form-container bg-light border-none">
      <div className="booking-form-group">
        <h2 className="booking-form-title">{enquiryFormTitle || "Enquire Now"}</h2>
        <input type="hidden" name="enquiryForm" value={formType} id="enquiryForm" className="booking-form-input" />
        <label className="booking-form-label" htmlFor="fullName">
          Full Name
        </label>
        <input
          className="booking-form-input"
          type="text"
          id="fullName"
          name="fullName"
          value={formState.fullName}
          placeholder="Enter full name"
          onChange={handleChange}
        />
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="mobileNumber">
          Mobile Number
        </label>
        <div className="d-flex">
          <select
            name="countryCode"
            className="booking-form-input w-20 mr-2"
            value={formState.countryCode}
            onChange={handleChange}
            style={{ minWidth: "90px", marginRight: "10px" }}
          >
            <option value="">Code</option>
            {countryCodes.map((code) => (
              <option value={code.dial_code} key={code.code}>
                {code.dial_code}
              </option>
            ))}
          </select>
          <input
            className="booking-form-input flex-1"
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formState.mobileNumber}
            placeholder="Enter phone number"
            onChange={handleChange}
            maxLength={10}
            style={{ flex: 1 }}
          />
        </div>
      </div>
      <div className="booking-form-group">
        <input
          id="isWhatsApp"
          type="checkbox"
          checked={formState.isWhatsApp}
          onChange={() =>
            setFormState({
              ...formState,
              isWhatsApp: !formState.isWhatsApp,
            })
          }
        />{" "}
        <label className="f-12" htmlFor="isWhatsApp">
          This is my WhatsApp number
        </label>
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="email">
          Email
        </label>
        <input
          className="booking-form-input"
          type="email"
          id="email"
          name="email"
          value={formState.email}
          placeholder="Enter email address"
          onChange={handleChange}
        />
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="message">
          Message
        </label>
        <textarea
          className="booking-form-textarea"
          id="message"
          name="message"
          rows={4}
          value={formState.message}
          placeholder="Enter your query"
          onChange={handleChange}
        />
        {errors.message && (
          <span className="text-red-600 text-xs">{errors.message}</span>
        )}
      </div>

      <HCaptcha
        sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
        reCaptchaCompat={false}
        onVerify={onHCaptchaChange}
        ref={captchaRef}
      />
      <div className="booking-form-group mb-3">
        <input
          id="agreePolicy"
          type="checkbox"
          checked={formState.agreePolicy}
          onChange={() =>
            setFormState({
              ...formState,
              agreePolicy: !formState.agreePolicy,
            })
          }
        />{" "}
        <label className="f-12" htmlFor="agreePolicy">
          I agree to the Terms & Conditions and Privacy Policy.
        </label>
      </div>
      {result && !submitted ? <button type="submit"
        className={`rounded-5 btn ${isFormInvalid() ? "btn-secondary" : "btn-primary"
          }`}
        disabled={true}>{submitted && <span className="spinner-border spinner-border-sm me-2" />}{submitted ? "Submitting..." : "Submitted"}</button>
        : <button
          type="submit"
          className={`rounded-5 btn ${isFormInvalid() ? "btn-secondary" : "btn-primary"
            }`}
          disabled={isFormInvalid()}
        >
          Submit Request
        </button>}

    </form>
  );
};

export default EnquiryForm;
