import React from "react";
import doctorIcon from "../assets/images/doctor-icon.png";
import calendarIcon from "../assets/images/calendar-icon.png";
import packageIcon from "../assets/images/package-icon.png";
import whatsappIcon from "../assets/images/whatsapp-icon.png";

const MobileNav = () => {
  return (
    <div className="banner-mobile-menu">
      <div class="mobile-nav-item">
        <img src={calendarIcon} width={"30px"} alt="appointment icon" />
        <span>Appointment</span>
      </div>

      <div class="mobile-nav-item">
        <img src={doctorIcon} width={"30px"} />
        <span>Second Opinion</span>
      </div>

      <div class="mobile-nav-item">
        <img src={packageIcon} width={"30px"} />
        <span>Health Packages</span>
      </div>

      <div class="mobile-nav-item">
        <img src={whatsappIcon} width={"30px"} />
        <span>WhatsApp</span>
      </div>
    </div>
  );
};

export default MobileNav;
