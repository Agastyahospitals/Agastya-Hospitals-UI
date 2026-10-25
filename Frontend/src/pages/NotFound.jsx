import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const NotFound = () => {
  return (
    <div className="container py-5 text-center my-5">
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        robots="noindex, nofollow"
      />
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="p-5 rounded-4 shadow-sm bg-white border">
            <h1
              className="display-1 fw-bold text-primary mb-3"
              style={{ color: "#022b50", fontSize: "72px" }}
            >
              404
            </h1>
            <h2 className="mb-3 fw-bold" style={{ color: "#16375b" }}>
              Page Not Found
            </h2>
            <p className="text-muted fs-5 mb-4">
              We couldn't find the page you were looking for. The link might be broken,
              the URL might have changed, or the page may have been removed.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <Link
                to="/"
                className="btn btn-primary px-4 py-2"
                style={{
                  background: "#022b50",
                  borderColor: "#022b50",
                  borderRadius: "25px",
                  fontWeight: 600,
                }}
              >
                Back to Home
              </Link>
              <Link
                to="/specialties"
                className="btn btn-outline-primary px-4 py-2"
                style={{ borderRadius: "25px", fontWeight: 600 }}
              >
                Our Specialties
              </Link>
              <Link
                to="/find-doctor"
                className="btn btn-outline-primary px-4 py-2"
                style={{ borderRadius: "25px", fontWeight: 600 }}
              >
                Find a Doctor
              </Link>
              <Link
                to="/contact-us"
                className="btn btn-outline-secondary px-4 py-2"
                style={{ borderRadius: "25px", fontWeight: 600 }}
              >
                Contact Us
              </Link>
            </div>
            <div className="mt-5 pt-3 border-top text-muted small">
              Need immediate medical assistance? Call our 24/7 Helpline:{" "}
              <strong>040 65 108 108</strong> or <strong>+91 9459 108 108</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
