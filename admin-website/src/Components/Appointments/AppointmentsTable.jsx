import React, { useState } from "react";
import TableComponent from "../Common/Component/TableComponent";
import { Badges } from "../../AbstractElements";
import { format } from "date-fns";
import { fetchDataPut } from "../../api/Services";
import { APPOINTMENTS_API } from "../../api";
import { Spinner } from "reactstrap";

const dropdownStyle = {
  position: "relative",
  display: "inline-block",
  marginLeft: "1rem",
};
const dropdownContentStyle = {
  display: "block",
  position: "absolute",
  backgroundColor: "#fff",
  minWidth: "160px",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  zIndex: 1,
  padding: "10px",
  border: "1px solid #eee",
};

const STATUS_OPTIONS = [
  { label: "Booked", value: "booked" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const AppointmentsTable = ({ appointments, flowType, title }) => {
  const [searchText, setSearchText] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [updatingIds, setUpdatingIds] = useState([]);

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    return a.appointmentID - b.appointmentID;
  });

  // Filter appointments based on searchText and selectedStatuses
  const filteredAppointments = sortedAppointments.filter((appointment) => {
    const search = searchText.toLowerCase();
    const matchesSearch =
      appointment.patientName?.toLowerCase().includes(search) ||
      appointment.doctorName?.toLowerCase().includes(search) ||
      String(appointment.appointmentID).includes(search) ||
      appointment.status?.toLowerCase().includes(search);

    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(appointment.status?.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // const filteredAppointments = appointments.filter((appointment) => {
  //   const search = searchText.toLowerCase();
  //   return (
  //     appointment.patientName?.toLowerCase().includes(search) ||
  //     appointment.doctorName?.toLowerCase().includes(search) ||
  //     String(appointment.appointmentID).includes(search) ||
  //     appointment.status?.toLowerCase().includes(search)
  //   );
  // });

  const renderTableBody = () => {
    const statusBg = (appStatus) => {
      switch (appStatus) {
        case "booked":
          return "info";
        case "completed":
          return "success";
        case "cancelled":
          return "danger";
        default:
          return "secondary";
      }
    };

    const statusColor = (appStatus) => {
      switch (appStatus) {
        case "booked":
          return "#17a2b8"; // blue/info
        case "completed":
          return "#28a745"; // green/success
        case "cancelled":
          return "#dc3545"; // red/danger
        default:
          return "#6c757d"; // secondary
      }
    };
    return (
      <tbody>
        {filteredAppointments?.length > 0 ? (
          filteredAppointments?.map((appointment) => (
            <tr key={appointment.appointmentID}>
              <td>{appointment.appointmentID}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.doctorName}</td>
              <td>{format(new Date(appointment.date), "dd/MM/yyyy")}</td>
              <td>
                {appointment.startTime} - {appointment.endTime}
              </td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select
                    value={appointment.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        setUpdatingIds((prev) => [...prev, appointment.appointmentID]);
                        await fetchDataPut(`${APPOINTMENTS_API}/${appointment.appointmentID}`, { status: newStatus });
                        // Refresh the page to show latest status
                        window.location.reload();
                      } catch (err) {
                        console.error("Failed to update appointment status:", err);
                        alert("Failed to update status. Please try again.");
                      } finally {
                        setUpdatingIds((prev) => prev.filter((id) => id !== appointment.appointmentID));
                      }
                    }}
                    className="form-select"
                    style={{
                      minWidth: 120,
                      backgroundColor: statusColor(appointment.status),
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 20,
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  >
                    {STATUS_OPTIONS.map((opt) => {
                      // Disable setting to 'booked' for appointments that are already expired
                      const isBookedOption = opt.value === 'booked';
                      let disableBooked = false;
                      if (isBookedOption) {
                        try {
                          const aptDate = new Date(appointment.date);
                          const now = new Date();
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                          const currentTime = now.toTimeString().slice(0,5);
                          // If appointment date is before today => expired
                          if (aptDate < today) disableBooked = true;
                          // If appointment date is today and endTime already passed => expired
                          if (!disableBooked && aptDate.getFullYear() === today.getFullYear() && aptDate.getMonth() === today.getMonth() && aptDate.getDate() === today.getDate()) {
                            if (appointment.endTime && appointment.endTime < currentTime) disableBooked = true;
                          }
                        } catch (e) {
                          disableBooked = false;
                        }
                      }
                      return (
                        <option key={opt.value} value={opt.value} disabled={isBookedOption ? disableBooked : false} title={isBookedOption && disableBooked ? 'Cannot set to Booked for past/expired appointments' : ''}>
                          {opt.label}
                        </option>
                      );
                    })}
                  </select>
                  {updatingIds.includes(appointment.appointmentID) && (
                    <Spinner size="sm" />
                  )}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">
              No appointments found
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <TableComponent
      title={title}
      headers={["#ID", "Patient Name", "Doctor Name", "Date", "Time", "Status"]}
      tableBody={renderTableBody()}
      isSearch={true}
      searchText={searchText}
      onSearch={(e) => setSearchText(e.target.value)}
    />
  );
};

export default AppointmentsTable;
