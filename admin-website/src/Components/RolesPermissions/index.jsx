import React, { Fragment, useState, useRef } from "react";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import { useNavigate } from "react-router-dom";
import { Card, Container, Form, Row } from "reactstrap";
import UserRolesForm from "./UserRolesForm";
import TableComponent from "../Common/Component/TableComponent";
import { USERS_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import Swal from "sweetalert2"; // Add this import
import { FaEdit, FaInfoCircle, FaPencilAlt, FaUserEdit } from "react-icons/fa"; // Add this import
import TableSkeleton from "../Common/Component/TableSkeleton";

const RolesPermissions = () => {
  const [showUserRoleForm, setShowUserRoleForm] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [editingUserRole, setEditingUserRole] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      const response = await fetchDataGet(USERS_API);
      setUserRoles(response);
      console.log("User Roles:", response);
    } catch (error) {
      console.error("Error fetching user roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user roles when the component mounts
  React.useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchUserRoles();
  }, []);

  const handleEdit = (userRole) => {
    setEditingUserRole(userRole);
    setIsEditMode(true);
    setShowUserRoleForm(true);
  };

  const handleCloseForm = () => {
    setShowUserRoleForm(false);
    setEditingUserRole(null);
    setIsEditMode(false);
  };

  const handleFormSuccess = () => {
    fetchUserRoles(); // Refresh the table data
    handleCloseForm();
  };

  return (
    <Fragment>
      {!showUserRoleForm ? (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <Breadcrumbs
              mainTitle="User Roles and Permissions"
              buttonTitle={"Add Role"}
              onClick={() => navigate(`/register-new-user?addRole=true`)}
            />
          </div>

          <Container fluid={true}>
            <UserRolesForm />
            <Row className="widget-grid">
              {loading ? (
                <TableSkeleton columns={3} />
              ) : (
                <TableComponent
                  headers={["User Name", "Role Name", "Action"]}
                  tableBody={
                    <tbody>
                      {userRoles?.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No user roles found
                          </td>
                        </tr>
                      ) : (
                        // Exclude default user role (roleID 4 / roleName 'User') from the table
                        userRoles
                          ?.filter(
                            (role) =>
                              Number(role?.roleID) !== 4 &&
                              String(role?.roleName).toLowerCase() !== "user"
                          )
                          .map((role, index) => (
                            <tr key={index}>
                              <td>{role.userName || role.fullName || "N/A"}</td>
                              <td>{role.roleName || role.loginType || "N/A"}</td>
                              <td>
                                <FaPencilAlt
                                  color="#7366ff"
                                  onClick={() => handleEdit(role)}
                                  className="cursor-pointer"
                                />
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  }
                />
              )}
            </Row>
          </Container>
        </>
      ) : (
        <UserRolesForm
          isEditMode={isEditMode}
          userRoleData={editingUserRole}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </Fragment>
  );
};

export default RolesPermissions;
