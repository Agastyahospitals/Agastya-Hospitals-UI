import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpecialties } from "../slices/specialtySlice";
import { setBreadcrumb } from "../slices/breadcrumbSlice";

const quickLinks = [
  { label: "About Us", path: "/about" },
  { label: "Patient Care", path: "/patient-care" },
  { label: "News & Updates", path: "/news-and-updates" },
  { label: "Careers", path: "/careers" },
  { label: "Blogs", path: "/blog" },
  { label: "Contact Us", path: "/contact-us" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
];

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (path, label) => {
    dispatch(setBreadcrumb(["Home", label]));
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll smoothly to top
  };
    const hasFetched = useRef(false);
    useEffect(() => {
      if (hasFetched.current) return;
      hasFetched.current = true;
    dispatch(fetchSpecialties());
  }, [dispatch]);

  return (
    <footer>
      <div className="footer-main container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Specialities</h3>
              {/* <ul>
                {specialties.data?.map((specialty) => (
                  <li key={specialty._id}>
                    <a
                      onClick={() =>
                        handleNavigation(`/specialties`)
                      }
                    >
                      {specialty.specialityName}
                    </a>
                  </li>
                ))}
              </ul> */}
              <ul>
                <li>
                  <a href="specialty/surgical-oncology">Surgical Oncology</a>
                </li>
                <li>
                  <a href="specialty/urology-and-andrology">Urology And Andrology</a>
                </li>
                <li>
                  <a href="specialty/orthopaedics">Orthopaedics</a>
                </li>
                <li>
                  <a href="specialty/gynaecology">Gynaecology</a>
                </li>
                <li>
                  <a href="specialty/neurology">Neurology</a>
                </li>
                <li>
                  <a href="specialty/emergency-medicine">Emergency Medicine</a>
                </li>
                <li>
                  <a href="specialty/cardiology">Cardiology</a>
                </li>
                <li>
                  <a href="specialty/vascular-surgery">Vascular Surgery</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Quick Links</h3>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <a
                      onClick={() => handleNavigation(link.path, link.label)}
                      style={{ cursor: "pointer" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">International Patient</a>
                </li>
                <li>
                  <a href="#">Gallery</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Blogs</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
              </ul>
            </div>
          </div> */}

          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Contact Info</h3>
              <p>info@agastyahospitals.com</p>
              <p>+91 9459 108 108</p>
              <h5 className="mt-5">24×7 Appointment Helpline</h5>
              <div className="helpline">
                <span className="dot"></span> +91 40 65 108 108
              </div>
            </div>
          </div>

           <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="widget">
              <h3>Follow Us On</h3>
              <div className="social-icons-footer">
                <a href="https://www.facebook.com/AgastyaHospitals" target="_blank"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16 3C16 3 18.6442 3 21.0605 4.02201C21.0605 4.02201 23.3936 5.00884 25.1924 6.80761C25.1924 6.80761 26.9912 8.60638 27.978 10.9395C27.978 10.9395 29 13.3558 29 16C29 16 29 18.6442 27.978 21.0605C27.978 21.0605 26.9912 23.3936 25.1924 25.1924C25.1924 25.1924 23.3936 26.9912 21.0605 27.978C21.0605 27.978 18.6442 29 16 29C16 29 13.3558 29 10.9395 27.978C10.9395 27.978 8.60638 26.9912 6.80761 25.1924C6.80761 25.1924 5.00884 23.3936 4.02202 21.0605C4.02202 21.0605 3 18.6442 3 16C3 16 3 13.3558 4.02202 10.9395C4.02202 10.9395 5.00885 8.60638 6.80761 6.80761C6.80761 6.80761 8.60638 5.00884 10.9395 4.02201C10.9395 4.02201 13.3558 3 16 3ZM16 5C16 5 13.7614 5 11.7186 5.86402C11.7186 5.86402 9.74476 6.69889 8.22183 8.22182C8.22183 8.22182 6.6989 9.74476 5.86402 11.7186C5.86402 11.7186 5 13.7614 5 16C5 16 5 18.2386 5.86402 20.2814C5.86402 20.2814 6.69889 22.2552 8.22183 23.7782C8.22183 23.7782 9.74476 25.3011 11.7186 26.136C11.7186 26.136 13.7614 27 16 27C16 27 18.2386 27 20.2814 26.136C20.2814 26.136 22.2552 25.3011 23.7782 23.7782C23.7782 23.7782 25.3011 22.2552 26.136 20.2814C26.136 20.2814 27 18.2386 27 16C27 16 27 13.7614 26.136 11.7186C26.136 11.7186 25.3011 9.74476 23.7782 8.22183C23.7782 8.22183 22.2552 6.69889 20.2814 5.86402C20.2814 5.86402 18.2386 5 16 5Z" fill="#ffffff"/>
<path d="M15 14V28C15 28.5523 15.4477 29 16 29C16.5523 29 17 28.5523 17 28V14C16.9984 13.5983 17.1497 13.2308 17.1497 13.2308C17.3011 12.8632 17.5821 12.5821 17.5821 12.5821C17.8632 12.301 18.2308 12.1497 18.2308 12.1497C18.5983 11.9984 18.9958 12 18.9958 12L21 12C21.5523 12 22 11.5523 22 11C22 10.4477 21.5523 10 21 10L19.0042 10C18.2067 9.99669 17.4693 10.3003 17.4693 10.3003C16.7318 10.604 16.1679 11.1679 16.1679 11.1679C15.604 11.7318 15.3003 12.4693 15.3003 12.4693C14.9967 13.2067 15 14 15 14Z" fill="#ffffff"/>
<path d="M12 19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H12C11.4477 17 11 17.4477 11 18C11 18.5523 11.4477 19 12 19Z" fill="#ffffff"/>
</svg></a>
                <a href="https://www.youtube.com/@agastyahospitals" target="_blank"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5547 20.8322C14.3904 20.9417 14.1974 21.0001 14 21.0001C13.4477 21.0001 13 20.5524 13 20.0001V12.0001C13 11.8027 13.0584 11.6097 13.1679 11.4454C13.4743 10.9859 14.0952 10.8617 14.5547 11.1681L20.5547 15.1681C20.6646 15.2413 20.7588 15.3356 20.8321 15.4454C21.1384 15.9049 21.0142 16.5258 20.5547 16.8322L14.5547 20.8322ZM18.1972 16.0001L15 18.1316V13.8686L18.1972 16.0001Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.70711 8.72365C2.70711 8.72365 2.8876 8.02866 3.36218 7.48981C3.36218 7.48981 3.83676 6.95097 4.51808 6.67838C4.51808 6.67838 7.26726 5.62795 11.9237 5.23481C11.9237 5.23481 14.2262 5.04041 15.9946 5.05003C15.9946 5.05003 17.7738 5.04041 20.0763 5.23481C20.0763 5.23481 24.7327 5.62795 27.4966 6.68413C27.4966 6.68413 28.1632 6.95096 28.6378 7.48981C28.6378 7.48981 29.1124 8.02866 29.2939 8.72742C29.2939 8.72742 30 11.4906 30 16C30 16 30 20.5095 29.2929 23.2764C29.2929 23.2764 29.1124 23.9714 28.6378 24.5102C28.6378 24.5102 28.1632 25.0491 27.4819 25.3216C27.4819 25.3216 24.7327 26.3721 20.0763 26.7652C20.0763 26.7652 17.7738 26.9596 16.0054 26.95C16.0054 26.95 14.2262 26.9596 11.9237 26.7652C11.9237 26.7652 7.26727 26.3721 4.50338 25.3159C4.50338 25.3159 3.83676 25.0491 3.36218 24.5102C3.36218 24.5102 2.8876 23.9714 2.70614 23.2726C2.70614 23.2726 2 20.5095 2 16C2 16 2 11.4906 2.70614 8.72742L2.70711 8.72365ZM4.6429 9.22638C4.6429 9.22638 4 11.7453 4 16C4 16 4 20.258 4.64386 22.7774C4.64386 22.7774 4.70356 23.0072 4.86306 23.1883C4.86306 23.1883 5.02257 23.3694 5.24662 23.4591C5.24662 23.4591 7.71713 24.4029 12.0919 24.7723C12.0919 24.7723 14.3051 24.9592 15.9946 24.95C15.9946 24.95 17.6949 24.9592 19.9081 24.7723C19.9081 24.7723 24.2829 24.4029 26.7681 23.4534C26.7681 23.4534 26.9774 23.3694 27.1369 23.1883C27.1369 23.1883 27.2964 23.0072 27.3571 22.7736C27.3571 22.7736 28 20.258 28 16C28 16 28 11.7421 27.3561 9.22261C27.3561 9.22261 27.2964 8.9928 27.1369 8.81169C27.1369 8.81169 26.9774 8.63058 26.7534 8.5409C26.7534 8.5409 24.2829 7.59708 19.9081 7.22772C19.9081 7.22772 17.6949 7.04087 16.0054 7.05C16.0054 7.05 14.3051 7.04087 12.0919 7.22772C12.0919 7.22772 7.71712 7.59708 5.23192 8.54665C5.23192 8.54665 5.02257 8.63058 4.86306 8.81169C4.86306 8.81169 4.7041 8.99218 4.64331 9.22478L4.6429 9.22638Z" fill="#ffffff"/>
</svg>
</a>
                <a href="https://www.instagram.com/agastyahospitals/" target="_blank"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16 10C16 10 18.4853 10 20.2426 11.7574C20.2426 11.7574 22 13.5147 22 16C22 16 22 18.4853 20.2426 20.2426C20.2426 20.2426 18.4853 22 16 22C16 22 13.5147 22 11.7574 20.2426C11.7574 20.2426 10 18.4853 10 16C10 16 10 13.5147 11.7574 11.7574C11.7574 11.7574 13.5147 10 16 10ZM16 12C16 12 14.3431 12 13.1716 13.1716C13.1716 13.1716 12 14.3431 12 16C12 16 12 17.6569 13.1716 18.8284C13.1716 18.8284 14.3431 20 16 20C16 20 17.6569 20 18.8284 18.8284C18.8284 18.8284 20 17.6569 20 16C20 16 20 14.3431 18.8284 13.1716C18.8284 13.1716 17.6569 12 16 12Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 10.5C3.5 10.5 3.5 7.60051 5.55025 5.55025C5.55025 5.55025 7.60051 3.5 10.5 3.5H21.5C21.5 3.5 24.3995 3.5 26.4497 5.55025C26.4497 5.55025 28.5 7.6005 28.5 10.5V21.5C28.5 21.5 28.5 24.3995 26.4497 26.4497C26.4497 26.4497 24.3995 28.5 21.5 28.5H10.5C10.5 28.5 7.6005 28.5 5.55025 26.4497C5.55025 26.4497 3.5 24.3995 3.5 21.5V10.5ZM5.5 10.5L5.5 21.5C5.5 21.5 5.5 23.5711 6.96447 25.0355C6.96447 25.0355 8.42893 26.5 10.5 26.5H21.5C21.5 26.5 23.5711 26.5 25.0355 25.0355C25.0355 25.0355 26.5 23.5711 26.5 21.5V10.5C26.5 10.5 26.5 8.42893 25.0355 6.96447C25.0355 6.96447 23.5711 5.5 21.5 5.5L10.5 5.5C10.5 5.5 8.42893 5.5 6.96447 6.96447C6.96447 6.96447 5.5 8.42893 5.5 10.5Z" fill="#ffffff"/>
<path d="M24 9.5C24 10.3284 23.3284 11 22.5 11C21.6716 11 21 10.3284 21 9.5C21 8.67163 21.6716 8 22.5 8C23.3284 8 24 8.67163 24 9.5Z" fill="#ffffff"/>
</svg>
</a>
                
              </div>
            </div>
            </div>
        </div>
      </div>

      <div className="footer-copy">
        Copyright © 2025 Agastya Hospitals (SRI LAKSHMI NARASIMHA HEALTH CARE PVT. LTD.). All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
