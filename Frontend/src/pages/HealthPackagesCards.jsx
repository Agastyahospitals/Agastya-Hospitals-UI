import React, { useState, useEffect, useRef } from "react";
import ModalComponent from "../components/common/ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchHealthPackages } from "../slices/healthPackages";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { toasterConfig } from "../utils";
import { stripHtml } from "../components/common/HtmlParser";

const HealthPackagesCards = () => {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [packageData, setPackageData] = useState({});
  const [formState, setFormState] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
  });
  const [showNote, setShowNote] = useState(false);
  const dispatch = useDispatch();
  const {
    healthPackages: packages,
    loading,
    error,
  } = useSelector((state) => state);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(fetchHealthPackages());
  }, [dispatch]);

  function getOriginalPrice(packageData) {
    let originalPrice = 0;
    if (packageData.discountType === "Fixed") {
      originalPrice = packageData.price + packageData.discountAmount;
    } else {
      originalPrice =
        packageData.price / (1 - packageData.discountAmount / 100);
    }
    return originalPrice.toFixed(2); // round to 2 decimals
  }

  function getDiscountPercentage(packageData) {
    if (packageData.discountType === "Fixed") {
      const originalPrice = packageData.price + packageData.discountAmount;
      const discountPercent =
        (packageData.discountAmount / originalPrice) * 100;
      return discountPercent.toFixed(2);
    } else {
      return packageData.discountAmount;
    }
  }

  const openBookNow = (data) => {
    setShowNote(false);
    setPackageData(data);
    setIsBookOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const isFormInvalid = () => {
    const requiredFields = ["fullName", "mobileNumber", "email"];
    return requiredFields.some(
      (field) =>
        formState[field] === null ||
        formState[field] === undefined ||
        formState[field] === "" ||
        (typeof formState[field] === "boolean" && formState[field] === false)
    );
  };

  const closeBooking = () => {
    setShowNote(false);
    setFormState({
      fullName: "",
      email: "",
      mobileNumber: "",
    });
    setIsBookOpen(false);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setShowNote(true);
  // };

  const validate = () => {
    const errors = {};
    if (!formState.fullName) {
      errors.fullName = "Full name is required";
    }
    if (!formState.email) {
      errors.email = "Email is required";
    }
    if (!formState.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // setSubmitted(true);
      // setResult(false);
      const formData = new FormData(e.target);
      formData.append("access_key", "09952932-0e2d-40a1-8514-31fdc2bd87ff");
      // formData.append("contactForm", "Contact Form");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setShowNote(true);
        // setSubmitted(true);
        toasterConfig("success", "Enquiry submitted successfully, we will get back to you soon!");
        captchaRef.current.resetCaptcha();
        resetForm();
      } else {
        // setSubmitted(false);
        toasterConfig("error", "Failed to submit enquiry, please try again!");
        resetForm();
      }
    }
  };

  const onHCaptchaChange = (token) => {
    setFormState((prev) => ({
      ...prev,
      "h-captcha-response": token
    }));
  };
  const captchaRef = useRef(null);


  return (
    <>
      <div class="row g-4 m-0">
        {packages.packages?.map((pkg) => (
          <div className="col-lg-6 col-md-3 packagecard-internal">
            <div className="package-card-internal shadow-md border-1">
              <span className="discount-badge">
                {getDiscountPercentage(pkg)}% Off
              </span>
              <h5 className="packagename">{pkg.packageName}</h5>
              <p className="tests-covered">Tests Covered: {pkg.totalLabTests}</p>
              <ul
                className="tests-list"
                style={{
                  height: "100px",
                  overflowY: "scroll",
                  listStylePosition: "outside",
                  paddingLeft: "20px",
                }}
              >
                {pkg.coveredTests.map((test, idx) => (
                  <li key={idx}>{stripHtml(test)}</li>
                ))}
              </ul>
              <div className="price-container">
                <span className="price">
                  INR {pkg.price.toLocaleString("en-IN")}/-
                </span>
                <span className="old-price">INR {getOriginalPrice(pkg)}/-</span>
              </div>
              <button
                className="packagebook-btn mt-3"
                onClick={() => openBookNow(pkg)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalComponent
        isOpen={isBookOpen}
        onHide={closeBooking}
        data={packageData}
        mtitle={"Book Health Package"}
        children={
          <>
            {showNote ? (
              <p className="f-16 f-w-400 text-center">
                Thank you,{" "}
                <span className="f-w-600 text-success">
                  {formState.fullName}
                </span>
                . <br />
                Your request for the Health Package has been successfully
                submitted. <br />
                Our team will review it and get back to you shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row m-0">
                  <div className="booking-form-group my-0">
                    <input
                      type="hidden"
                      name="healthPackage"
                      value={packageData.packageName + " - Rs." + packageData.price + "/- " + packageData.ageGroup}
                      id="healthPackage"
                      className="booking-form-input"
                    />
                    <label for="fullName" className="booking-form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="booking-form-input"
                      value={formState.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div className="row m-0">
                  <div className="booking-form-group my-0">
                    <label for="mobileNumber" className="booking-form-label">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id="mobileNumber"
                      name="mobileNumber"
                      className="booking-form-input"
                      value={formState.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="row m-0">
                  <div className="booking-form-group my-0">
                    <label for="email" className="booking-form-label">
                      Email Address
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="booking-form-input"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col-md-12 pl-3">
                    <HCaptcha
                      sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                      reCaptchaCompat={false}
                      onVerify={onHCaptchaChange}
                      ref={captchaRef}
                    />
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-md-12 text-center">
                    <button
                      type="submit"
                      className={`btn ${isFormInvalid() ? "btn-secondary" : "btn-primary"
                        }`}
                      disabled={isFormInvalid()}
                    >
                      Submit
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-danger py-2"
                      onClick={closeBooking}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        }
      />
    </>
  );
};

export default HealthPackagesCards;
