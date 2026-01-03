import React from "react";
import { Card, Col, Label, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";

const PatientDetails = ({ patientDetails }) => {
  return (
    <>
      <Card className="px-3 py-4">
        <h6 className="b-b-light pb-3">Personal Info</h6>
        <Row className="m-0 widget-grid">
          <Col md="6">
            <ul>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">UHID:</Label>
                <span className="f-w-500">
                  {patientDetails.patientID ? patientDetails.patientID : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Full Name:</Label>
                <span className="f-w-500">
                  {patientDetails.fullName ? patientDetails.fullName : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Phone Number:</Label>
                <span className="f-w-500">
                  {patientDetails.mobile ? patientDetails.mobile : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Email:</Label>
                <span className="f-w-500">
                  {patientDetails.email ? patientDetails.email : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Address:</Label>
                <span className="f-w-500">
                  {patientDetails.address ? patientDetails.address : "---"}
                </span>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <Label className="form-label text-muted">Past History:</Label>
                <span className="f-w-500">
                  {patientDetails.pastHistory
                    ? patientDetails.pastHistory
                    : "---"}
                </span>
              </li>
              <li className="d-flex justify-content-between">
                <Label className="form-label text-muted">Date of Birth:</Label>
                <span className="f-w-500">
                  {patientDetails.dob
                    ? new Date(patientDetails.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "---"}
                </span>
              </li>
            </ul>
          </Col>
          <Col md="6 bg-light rounded"></Col>
        </Row>
      </Card>
      <Card className="px-3 py-4">
        <h6 className="b-b-light pb-3">Medical Records</h6>
        <Row className="widget-grid">
          <Col md="12 px-0">
            {!patientDetails.medicalRecords || patientDetails.medicalRecords.length === 0 ? (
              <p className="text-muted text-center py-3">No medical records found.</p>
            ) : (
              <div className="medical-records-container">
                <div className="row">
                  {patientDetails.medicalRecords.map((recordUrl, index) => {
                    const fileName = recordUrl.split("/").pop();
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                    const isPdf = /\.pdf$/i.test(fileName);

                    return (
                      <div key={index} className="col-md-4 mb-3">
                        <div className="card h-100 shadow-sm">
                          {isImage ? (
                            <>
                              <img
                                src={recordUrl}
                                alt={fileName}
                                className="card-img-top"
                                style={{ height: "200px", objectFit: "cover" }}
                              />
                              <div className="card-body">
                                <p className="card-text small text-truncate" title={fileName}>
                                  {fileName}
                                </p>
                                <a
                                  href={recordUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-primary"
                                >
                                  View Full
                                </a>
                              </div>
                            </>
                          ) : isPdf ? (
                            <>
                              <div
                                className="card-img-top bg-light d-flex align-items-center justify-content-center"
                                style={{ height: "200px" }}
                              >
                                <span className="text-danger" style={{ fontSize: "48px" }}>
                                  📄
                                </span>
                              </div>
                              <div className="card-body">
                                <p className="card-text small text-truncate" title={fileName}>
                                  {fileName}
                                </p>
                                <a
                                  href={recordUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-primary"
                                >
                                  Open PDF
                                </a>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className="card-img-top bg-light d-flex align-items-center justify-content-center"
                                style={{ height: "200px" }}
                              >
                                <span className="text-secondary" style={{ fontSize: "48px" }}>
                                  📎
                                </span>
                              </div>
                              <div className="card-body">
                                <p className="card-text small text-truncate" title={fileName}>
                                  {fileName}
                                </p>
                                <a
                                  href={recordUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-primary"
                                >
                                  Download
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default PatientDetails;
