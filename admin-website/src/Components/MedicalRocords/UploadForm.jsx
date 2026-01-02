import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Row,
  Spinner,
  Alert,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../../slices/patientSlice";
import { uploadMedicalRecords, updatePatient } from "../../api/Services";
import { toast } from "react-toastify";

const UploadForm = ({ onClose, patientID }) => {
  const [patientName, setPatientName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [patientData, setPatientData] = useState({});
  const [originalMedicalRecords, setOriginalMedicalRecords] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [recordsChanged, setRecordsChanged] = useState(false);
  const dispatch = useDispatch();
  const {
    data: patients,
    error,
    loading,
  } = useSelector((state) => {
    return state.patients;
  });

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  useEffect(() => {
    if (patientID) {
      let patient = patients.filter((p) => p.patientID === patientID)[0];
      setPatientData(patient || {});
      setPatientName(patientID);
      setOriginalMedicalRecords((patient && patient.medicalRecords) || []);
      setRecordsChanged(false);
    }
  }, [patientID]);

  // Determine if current user is read-only 'User' (roleID 4)
  const isReadOnlyUser = (() => {
    try {
      const ud = JSON.parse(localStorage.getItem('userDetails')) || {};
      return Number(ud.roleID) === 4 || String(ud.roleName).toLowerCase() === 'user';
    } catch (e) {
      return false;
    }
  })();

  const handlePatientChange = (e) => {
    const value = e.target.value;
    const selectedPatient = patients.find(
      (patient) => String(patient.patientID) === value
    );
    setPatientData(selectedPatient);
    setPatientName(e.target.value);
    setUploadError(""); // Clear any previous errors
    setOriginalMedicalRecords((selectedPatient && selectedPatient.medicalRecords) || []);
    setRecordsChanged(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => {
      // Prevent duplicates by name (optional)
      const existingNames = prevFiles.map((f) => f.name + f.lastModified);
      const newFiles = files.filter(
        (f) => !existingNames.includes(f.name + f.lastModified)
      );
      return [...prevFiles, ...newFiles];
    });
    setUploadError(""); // Clear any previous errors
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDeleteMedicalRecord = (index) => {
    // Remove from UI immediately
    setPatientData((prev) => ({
      ...prev,
      medicalRecords: prev.medicalRecords.filter((_, i) => i !== index),
    }));
    // Mark that records were changed so Save button enables
    setRecordsChanged(true);
    // TODO: Call backend API to delete the file from server/storage if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientData.patientID) {
      setUploadError("Please select a patient");
      return;
    }

    if (selectedFiles.length === 0 && !recordsChanged) {
      setUploadError("Please select at least one file to upload or remove an existing record");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // If only records were changed (deleted) and no new files, update patient
      if (selectedFiles.length === 0 && recordsChanged) {
        const updateResp = await updatePatient(patientData.patientID, {
          medicalRecords: patientData.medicalRecords || [],
        });
        toast.success(`Medical records updated for ${patientData.fullName}`);

        // Refresh patients list in parent/state
        dispatch(fetchPatients());

        // Reset and close
        setSelectedFiles([]);
        setPatientName("");
        setPatientData({});
        setOriginalMedicalRecords([]);
        setRecordsChanged(false);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        setTimeout(() => onClose(), 1200);
      } else if (selectedFiles.length > 0 && recordsChanged) {
        // If both deletion and addition: first update the deleted list, then upload new files
        await updatePatient(patientData.patientID, {
          medicalRecords: patientData.medicalRecords || [],
        });
        const response = await uploadMedicalRecords(
          patientData.patientID,
          selectedFiles
        );
        toast.success(
          `Successfully uploaded ${selectedFiles.length} medical record(s) for ${patientData.fullName}`
        );

        // Refresh patients list in parent/state
        dispatch(fetchPatients());

        // Reset
        setSelectedFiles([]);
        setPatientName("");
        setPatientData({});
        setOriginalMedicalRecords([]);
        setRecordsChanged(false);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        setTimeout(() => onClose(), 1500);
      } else {
        // Only new files to upload
        const response = await uploadMedicalRecords(
          patientData.patientID,
          selectedFiles
        );
        if (response.updatedCount > 0) {
          toast.success(
            `Successfully uploaded ${selectedFiles.length} medical record(s) for ${patientData.fullName}`
          );
          // Refresh patients list in parent/state
          dispatch(fetchPatients());

          setSelectedFiles([]);
          setPatientName("");
          setPatientData({});
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = "";
          setTimeout(() => onClose(), 1500);
        } else {
          throw new Error("No records were updated");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error.response?.data?.message ||
          "Failed to upload medical records. Please try again."
      );
      toast.error("Failed to upload medical records");
    } finally {
      setIsUploading(false);
    }
  };

  function hasValues(patientData) {
    return Object.values(patientData).some(
      (v) => v !== null && v !== "" && v !== undefined
    );
  }

  return (
    <>
      <Breadcrumbs
        mainTitle={"Upload Medical Records"}
        buttonTitle={"Back to list"}
        btnColor={"secondary"}
        onClick={onClose}
      />
      <Container fluid={true}>
        <Form onSubmit={handleSubmit}>
          {uploadError && (
            <Alert color="danger" className="mb-3">
              {uploadError}
            </Alert>
          )}
          <Row>
            <Col sm="6">
              <Card>
                <CardBody>
                  <h6 className="b-b-light pb-2">Select Patient</h6>
                  <Input
                    type="select"
                    className="mt-3"
                    placeholder="Select Patient"
                    name="patientSelect"
                    value={patientName}
                    onChange={handlePatientChange}
                    disabled={isUploading}
                  >
                    <option value="">Select a Patient</option>
                    {patients.length > 0 &&
                      patients.map((patient) => (
                        <option
                          key={patient.patientID}
                          value={patient.patientID}
                        >
                          {patient.patientID} - {patient.fullName}
                        </option>
                      ))}
                  </Input>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h6 className="b-b-light pb-2">Upload Medical Records</h6>
                  {patientData.medicalRecords &&
                    patientData.medicalRecords.length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted">
                          Existing Medical Records:
                        </small>
                        <ul className="list-unstyled mt-1">
                          {patientData.medicalRecords.map((url, idx) => (
                            <li
                              key={idx}
                              className="text-truncate d-flex align-items-center"
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <small className="text-primary">
                                  {url.split("/").pop()}
                                </small>
                              </a>
                              <Button
                                close
                                aria-label="Delete"
                                onClick={() => handleDeleteMedicalRecord(idx)}
                                style={{ marginLeft: 8 }}
                                disabled={isUploading || isReadOnlyUser}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  <Input
                    type="file"
                    className="mt-3"
                    name="medicalRecords"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                    disabled={isUploading || isReadOnlyUser}
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Selected {selectedFiles.length} file(s):
                      </small>
                      <ul className="list-unstyled mt-1">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="text-truncate">
                            <small className="text-info">• {file.name}</small>
                            <Button
                              close
                              aria-label="Remove"
                              onClick={() => handleRemoveFile(index)}
                              style={{ marginLeft: 8 }}
                              disabled={isUploading || isReadOnlyUser}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col sm="6">
              <Card>
                <CardBody>
                  <h6 className="b-b-light pb-2">Patient Details</h6>
                  {patientData && hasValues(patientData) ? (
                    <div>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Patient ID:</strong>{" "}
                        {patientData.patientID}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Name:</strong>{" "}
                        {patientData.fullName}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Gender:</strong>{" "}
                        {patientData.gender}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Email:</strong>{" "}
                        {patientData.email}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Phone:</strong>{" "}
                        {patientData.mobile}
                      </p>
                      <p className="d-flex justify-content-between">
                        <strong className="text-muted">Date of Birth:</strong>{" "}
                        {new Date(patientData.dob).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted pt-3">
                      Select a patient to view details
                    </p>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col md="12" className="text-center mt-1">
              {!isReadOnlyUser && (
                <Button
                  color="primary"
                  type="submit"
                  disabled={
                    isUploading || !patientData.patientID || (selectedFiles.length === 0 && !recordsChanged)
                  }
                >
                  {isUploading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Uploading...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default UploadForm;
