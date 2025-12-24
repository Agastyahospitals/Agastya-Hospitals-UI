import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpecialties } from "../slices/specialtySlice";
import { useNavigate } from "react-router-dom";
import { setBreadcrumb } from "../slices/breadcrumbSlice";
import { specialtyFaqs } from "../components/common/FAQs";

const Specialties = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { specialties, loading: isLoading } = useSelector(
    (state) => state.specialties
  );

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const sortedData = Array.isArray(specialties?.data)
    ? [...specialties?.data].sort((a, b) =>
      a.specialityName.localeCompare(b.specialityName)
    )
    : [];
  const toggleFAQ = (id) => {
    if (openFAQ === id) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(id);
    }
  };

  return (
    <div>
      <div className="container py-5">
        {isLoading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading specialties...</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-12 text-center mb-12">
              <h2 className="main-title-center">Best Super Specialty Hospital in LB Nagar, Hyderabad</h2>
            </div>

            <div className="col-lg-12">
              <p className="mb-3">Agastya Hospitals is a Leading Super Specialty Hospital in LB Nagar, Hyderabad, offering comprehensive medical, surgical, and critical care services under one roof. Our speciality departments are led by experienced consultants, skilled clinical teams, and advanced medical infrastructure, ensuring accurate diagnosis, effective treatment, and faster recovery.</p>
              <p className="mb-5">We follow a multidisciplinary approach, where specialists collaborate closely to deliver personalized, evidence-based, and ethical healthcare for patients from Hyderabad, Telangana, and across India.</p>

              <h2 className="h2-title">Comprehensive Multispecialty Care Under One Roof</h2>
              <p className="mb-5">At Agastya Hospitals, every speciality is supported by advanced diagnostics, modern operation theatres, critical care units, and rehabilitation services—ensuring end-to-end care from consultation to recovery.</p>
            </div>

            {sortedData?.length > 0 ? (
              sortedData.map((specialty) => (
                <div key={specialty._id} className="col-lg-3">
                  {/* <div className=""> */}
                  <div className="specialtypage-card">
                    <div className="mb-3">
                      {specialty.icon ||
                        (specialty.banner && specialty.banner.length > 0) ? (
                        <img
                          src={specialty.icon || specialty.banner[0]}
                          alt={specialty.specialityName}
                          className="specialtypage-icon"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <svg
                          className="bd-placeholder-img rounded-circle"
                          width="50"
                          height="50"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label="Specialty icon"
                          preserveAspectRatio="xMidYMid slice"
                          focusable="false"
                        >
                          <rect
                            width="100%"
                            height="100%"
                            fill="#e3e6ea"
                          ></rect>
                          <text
                            x="50%"
                            y="55%"
                            textAnchor="middle"
                            fill="#adb5bd"
                            fontSize="18"
                          >
                            <tspan>:)</tspan>
                          </text>
                        </svg>
                      )}
                    </div>
                    <h5 className="specialtypage-name">
                      {specialty.specialityName}
                    </h5>
                    <p className="specialtypage-desc" style={{ minHeight: 40 }}>
                      {specialty.shortDescription}
                    </p>

                    <div className="specialtypage-btn">
                      <a
                        className="f-12 text-primary cursor-pointer"
                        onClick={() => {
                          dispatch(
                            setBreadcrumb(["Home", specialty.specialityName])
                          );
                          navigate(`/specialty/${specialty.specialityName.toLowerCase().replace(/\s+/g, "-")}`, {
                            //state: { specialityID: specialty.specialityID },
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" }); // scroll smoothly to top
                        }}
                      >
                        Know more
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-5">
                No Specialties available...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-12">
            <h2 className="h2-title">Why Choose Agastya Hospitals for Specialized Care in LB Nagar, Hyderabad?</h2>
            <p>Choosing the right hospital is a critical decision that directly impacts clinical outcomes, recovery time, and overall patient experience. <b>Agastya Hospitals, LB Nagar</b>, stands apart by delivering <b>specialized medical care that combines clinical excellence, ethical practices, and personalized attention,</b> making it a preferred healthcare destination in East Hyderabad.</p>

            <ul className="list-item-brandicon">
              <li>Patient-Centric Care Backed by Clinical Expertise</li>
              <li>Experienced Specialists with Multidisciplinary Collaboration</li>
              <li>Advanced Medical Infrastructure with Practical Innovation</li>
              <li>Ethical, Transparent, and Affordable Treatment</li>
              <li>Strategic Location Advantage in LB Nagar, East Hyderabad</li>
              <li>Faster Access to Doctors & Personalized Attention</li>
              <li>Trusted by Local & Regional Communities</li>
              <li>A Human Approach to Advanced Healthcare</li>
            </ul>

            <p className="f-w-600">Experience Specialized Care with a Personal Touch at Agastya Hospitals, LB Nagar, Hyderabad. <br />
              Book an appointment today and take a confident step toward better health.</p>


          </div>
        </div>
      </div>

      <div className="row intl-faqs-section mt-5">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="main-title-center mb-12">FAQs</h2>
            </div>
          </div>
          <div className="container mx-auto px-4">

            <div className="max-w-4xl mx-auto">
              {specialtyFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <span className={`text-2xl transition-transform duration-200 ${openFAQ === faq.id ? 'rotate-45' : ''
                      }`}>
                      +
                    </span>
                  </button>

                  {openFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>
      </div>




    </div>
  );
};

export default Specialties;
