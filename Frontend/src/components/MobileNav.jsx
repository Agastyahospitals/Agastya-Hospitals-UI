import React from "react";
import doctorIcon from "../assets/images/doctor-icon.png";
import calendarIcon from "../assets/images/calendar-icon.png";
import packageIcon from "../assets/images/package-icon.png";
import whatsappIcon from "../assets/images/whatsapp-icon.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "../slices/breadcrumbSlice";


const MobileNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="banner-mobile-menu">
      <div
        class="mobile-nav-item"
        onClick={() => {
          dispatch(setBreadcrumb(["Home", "Book Appointment"]));
          navigate("/book-appointment");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <img src={calendarIcon} width={"30px"} alt="appointment icon" />
        <span>Appointment</span>
      </div>

      <div
        class="mobile-nav-item"
        onClick={() => {
          dispatch(setBreadcrumb(["Home", "Expert Second Opinion"]));
          navigate("/free-second-opinion");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <img src={doctorIcon} width={"30px"} />
        <span>Second Opinion</span>
      </div>

      <div
        class="mobile-nav-item"
        onClick={() => {
          dispatch(setBreadcrumb(["Home", "Health Packages"]));
          navigate("/health-packages");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <img src={packageIcon} width={"30px"} />
        <span>Health Packages</span>
      </div>

      <div
        class="mobile-nav-item"
        onClick={() => window.open("https://wa.me/9876543210", "_blank")}
      >
        <img src={whatsappIcon} width={"30px"} />
        <span>WhatsApp</span>
      </div>
    </div>
  );
};

export default MobileNav;
