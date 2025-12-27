import React, { Fragment, useState, useEffect } from "react";
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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { countryCodes } from "../api/countryCode";
import { toast } from "react-toastify";
import { registerUser, fetchLoginTypes } from "../api/Services";

const RegisterFrom = () => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isAddRoleFlow, setIsAddRoleFlow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.debug("handleSubmit called", { isAddRoleFlow, selectedRoleId, rolesCount: roles.length });
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (isAddRoleFlow && !selectedRoleId) {
      toast.error("Please select a role before creating user");
      return;
    }

    setIsSubmitting(true);

    try {
      
      // determine role and modules based on addRole flow
      let roleID = 4; // default role (user)
      let modules = ["5", "14"]; // default modules

      if (isAddRoleFlow) {
        // find selected role object
        const sel = roles.find((r) => {
          // role id may be in different properties
          return (
            String(r._id) === String(selectedRoleId) ||
            String(r.id) === String(selectedRoleId) ||
            String(r.roleID) === String(selectedRoleId)
          );
        }) || {};

        // prefer explicit properties if present
        roleID = sel.roleID ?? sel.id ?? sel._id ?? selectedRoleId;

        // determine modules if provided on role object
        modules =
          sel.modules || sel.moduleIDs || sel.modulesList || sel.assignedModules || modules;

        // ensure modules are strings (backend in this project used strings previously)
        if (Array.isArray(modules)) {
          modules = modules.map((m) => String(m));
        }
      }

      const payload = {
        userName: fullName,
        email,
        password,
        rawPassword: password,
        mobile: phone,
        whatsAppNumber: phone,
        isActive: true,
        roleID: roleID,
        countryCode: countryCode,
        modules: modules,
      };

      console.debug("Register payload:", payload);
      const data = await registerUser(payload);
      console.debug("Register response:", data);
      toast.success(data.message || "User registered successfully");
      // Only set token/userDetails for normal sign up (not adding via Roles page)
      if (!isAddRoleFlow) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("userDetails", JSON.stringify(data.user));
        }
      }

      // redirect: back to roles page when created via Add Role flow
      setTimeout(() => {
        if (isAddRoleFlow) {
          navigate("/roles-permissions");
        } else {
          navigate("/login");
        }
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error.response || error.message || error);
      toast.error("Registration failed. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // detect addRole flag from query params
    const params = new URLSearchParams(location.search);
    const flag = params.get("addRole");
    const isAdd = flag === "true" || flag === "1";
    setIsAddRoleFlow(Boolean(isAdd));

    const fetchRoles = async () => {
      try {
        const res = await fetchLoginTypes();
        if (Array.isArray(res)) {
          setRoles(res);
          // default select first role if available
          if (res.length > 0) setSelectedRoleId(res[0]._id ?? res[0].id ?? res[0].roleID ?? "");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    if (isAdd) {
      fetchRoles();
    }
  }, [location.search]);
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
              {isAddRoleFlow && (
                <FormGroup>
                  <Label className="col-form-label m-0 pt-0">Assign Role</Label>
                  <Input
                    type="select"
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select role</option>
                    {roles.map((r) => (
                      <option
                        key={r._id ?? r.id ?? r.roleID}
                        value={r._id ?? r.id ?? r.roleID}
                      >
                        {r.roleName || r.loginType || r.name || r.label || r.displayName}
                      </option>
                    ))}
                  </Input>
                  <small className="text-muted">
                    This selection will be sent back to Roles page to prefill the add-role form. You will remain logged in as the current user.
                  </small>
                </FormGroup>
              )}
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
