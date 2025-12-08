import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  P,
  Image,
  H4,
  H5,
  H6,
  Btn,
  UL,
  LI,
} from "../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updatePassword } from "../../api/Services";
import axios from "axios";
import { toasterConfig } from "../../utils";
import { USERS_API } from "../../api";

const UserProfileCard = () => {
  const [togglePwd, setTogglePwd] = useState(false);
  const [currentpwd, setCurrentpwd] = useState("");
  const [newpwd, setNewpwd] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const [editUserDetails, setEditUserDetails] = useState(false);
  const [userData, setUserData] = useState({
    userName: "",
    mobile: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const { userDetails } = useSelector((state) => state.auth);

  useEffect(() => {
    setUserData({
      userName: userDetails.userName,
      mobile: userDetails.mobile,
      email: userDetails.email,
    });
  }, []);

  const resetForm = () => {
    setCurrentpwd("");
    setNewpwd("");
    setConfirmpwd("");
  };

  const onUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        currentPassword: currentpwd,
        newPassword: newpwd,
        confirmPassword: confirmpwd,
      };
      const res = await updatePassword(payload);
      toast.success(res?.message || "Password updated successfully");
      resetForm();
      setTogglePwd(false);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update password";
      toast.error(msg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "email") {
      if (!emailValidation(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Invalid email format",
        }));
      } else {
        setErrors((prevErrors) => {
          const { email, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const emailValidation = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      userName: userData.userName,
      mobile: userData.mobile,
      email: userData.email,
      roleID: userDetails.roleID,
      modules: userDetails.modules,
    };
    debugger;

    try {
      const response = await axios.put(
        `${USERS_API}?userID=${userDetails.userID}`,
        requestData
      );
      if (response.status === 200) {
        setEditUserDetails(false);
        toasterConfig("success", "User details updated successfully");
      }
    } catch (error) {
      toasterConfig(
        "error",
        "Failed to update user details, please try again later!"
      );
      setEditUserDetails(true);
    }

    console.log("Updated User Details:", requestData);
  };

  return (
    <>
      <Breadcrumbs mainTitle={"My Profile"} />

      <Container fluid={true}>
        <Row>
          <Col md="6">
            <Card>
              <CardBody>
                <UL>
                  <LI
                    attrLI={{
                      className: "d-flex justify-content-between mb-2",
                    }}
                  >
                    <H6>Name</H6>
                    <span>
                      {editUserDetails ? (
                        <input
                          className="form-control"
                          placeholder="user name"
                          name="userName"
                          value={userData.userName}
                          onChange={handleChange}
                        />
                      ) : (
                        userData.userName
                      )}
                    </span>
                  </LI>
                  <LI
                    attrLI={{
                      className: "d-flex justify-content-between mb-2",
                    }}
                  >
                    <H6>Contact No.</H6>
                    <span>
                      {editUserDetails ? (
                        <input
                          className="form-control"
                          name="mobile"
                          placeholder="mobile number"
                          value={userData.mobile}
                          onChange={handleChange}
                        />
                      ) : (
                        userData.mobile
                      )}
                    </span>
                  </LI>
                  <LI
                    attrLI={{
                      className: "d-flex justify-content-between mb-4",
                    }}
                  >
                    <H6>Email Address</H6>
                    <span>
                      {editUserDetails ? (
                        <input
                          className="form-control"
                          name="email"
                          placeholder="email address"
                          value={userData.email}
                          onChange={handleChange}
                        />
                      ) : (
                        userData.email
                      )}
                    </span>
                  </LI>
                  <LI attrLI={{ className: "d-flex justify-content-between" }}>
                    <Button
                      color={editUserDetails ? "primary" : "secondary"}
                      onClick={
                        editUserDetails
                          ? handleSubmit
                          : () => setEditUserDetails(true)
                      }
                      disabled={
                        editUserDetails &&
                        (userData.userName === "" ||
                          userData.mobile === "" ||
                          userData.email === "")
                      }
                    >
                      {editUserDetails ? "Update" : "Edit"}
                    </Button>
                    {editUserDetails && (
                      <Button
                        color="secondary"
                        onClick={() => setEditUserDetails(false)}
                      >
                        Cancel
                      </Button>
                    )}
                    &nbsp;&nbsp;&nbsp;
                    <Button
                      color="light"
                      onClick={() => setTogglePwd(!togglePwd)}
                    >
                      Change Password
                    </Button>
                  </LI>
                </UL>
              </CardBody>
            </Card>
          </Col>
          {togglePwd && (
            <Col md="6">
              <Card>
                <CardBody>
                  <Form onSubmit={onUpdatePassword}>
                    <FormGroup>
                      <Label>Current Password</Label>
                      <Input
                        type="text"
                        name="currentpwd"
                        value={currentpwd}
                        placeholder="Enter current password"
                        onChange={(e) => setCurrentpwd(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>New Password</Label>
                      <Input
                        type="text"
                        name="newpwd"
                        value={newpwd}
                        placeholder="Enter new password"
                        onChange={(e) => setNewpwd(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Confirm Password</Label>
                      <Input
                        type="text"
                        name="confirmpwd"
                        value={confirmpwd}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpwd(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={!(currentpwd && newpwd && confirmpwd)}
                      >
                        Update
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button
                        type="reset"
                        disabled={!(currentpwd || newpwd || confirmpwd)}
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default UserProfileCard;
