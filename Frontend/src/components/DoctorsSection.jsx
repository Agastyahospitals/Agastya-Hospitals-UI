import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSpecialties } from "../slices/specialtySlice";
import { DOCTORS_API, SPECIALITIES_API } from "../api/services";
import axios from "axios";
import { setBreadcrumb } from "../slices/breadcrumbSlice";
import { Carousel } from "react-bootstrap";

const DoctorsSection = () => {
  const [activeIndex, setActiveIndex] = useState();
  const [doctorList, setDoctorList] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [slides, setSlides] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth >= 992 ? 3 : 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (doctorList.length > 0) {
      const newSlides = [];
      for (let i = 0; i < doctorList.length; i += itemsPerSlide) {
        newSlides.push(doctorList.slice(i, i + itemsPerSlide));
      }
      setSlides(newSlides);
      setCarouselIndex(0);
    }
  }, [doctorList, itemsPerSlide]);
  const navigate = useNavigate();
  const { specialties, loading: isLoading } = useSelector(
    (state) => state.specialties
  );

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  const sortedData = Array.isArray(specialties?.data)
    ? [...specialties?.data].sort(
      (a, b) => (b.doctor?.length || 0) - (a.doctor?.length || 0)
    )
    : [];

  const specialtiesData = sortedData
    ?.filter((specialty) => specialty.doctor?.length > 0)
    .map((specialty) => {
      return {
        specialityName: specialty.specialityName,
        specialityID: specialty.specialityID,
      };
    });

  useEffect(() => {
    if (specialtiesData?.length > 0) {
      setActiveIndex(specialtiesData[0]?.specialityID);
      fetchDoctorsBySpecialty(specialtiesData[0]?.specialityID);
    }
  }, [specialties]);

  const fetchDoctorsBySpecialty = async (specialityID) => {
    try {
      const response = await axios.get(
        `${SPECIALITIES_API}?specialityID=${specialityID}`
      );
      if (response.data.doctor?.length > 0) {
        const { doctor, doctorNames } = response.data;
        const validDoctors = doctor.filter((doc, index) => {
          return doc && doctorNames?.[index];
        });

        let doctorsList = validDoctors.map((doc) => {
          const docResponse = axios.get(`${DOCTORS_API}?doctorID=${doc}`);
          return docResponse.then((res) => res.data);
        });
        const allDoctors = await Promise.all(doctorsList);
        const doctorDataList = allDoctors.map((doc) => doc.data);
        setDoctorList(doctorDataList);
        setActiveIndex(specialityID);
      } else {
        setDoctorList([]);
        setActiveIndex(specialityID);
      }
    } catch (error) {
      console.error("Error fetching doctors by specialty:", error);
      setDoctorList([]);
      setActiveIndex(specialityID);
    }
  };

  const handleSelect = (selectedIndex) => {
    setCarouselIndex(selectedIndex);
  };

  const handlePrev = () => {
    const newIndex = carouselIndex === 0 ? slides.length - 1 : carouselIndex - 1;
    setCarouselIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = carouselIndex === slides.length - 1 ? 0 : carouselIndex + 1;
    setCarouselIndex(newIndex);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="row">
          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">
              Our Expert Doctors For The Patients
            </h2>
          </div>
        </div>

        {/* Specialty Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 ">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            specialtiesData?.slice(0, 6)?.map((specialty) => (
              <button
                key={specialty.specialityID}
                className={`specialty-tabpill py-2 px-3 ${specialty.specialityID === activeIndex
                  ? "active"
                  : "specialty-tabpill"
                  }`}
                onClick={() => fetchDoctorsBySpecialty(specialty.specialityID)}
              >
                {specialty.specialityName}
              </button>
            ))
          )}
        </div>

        {/* Doctors Carousel */}
        <div className="relative mt-12 doctor-carousel-container position-relative">
          {doctorList.length > 0 ? (
            <>
              <button
                className="absolute border-1  start-0 top-50 translate-middle-y bg-white p-4 rounded-circle shadow-sm z-10 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px", left: "-50px" }}
                onClick={handlePrev}
              >
                <span className="f-40">←</span>
              </button>

              <Carousel
                activeIndex={carouselIndex}
                onSelect={handleSelect}
                indicators={false}
                controls={false}
                interval={null}
              >
                {slides.map((slide, index) => (
                  <Carousel.Item key={index}>
                    <div className="d-flex justify-content-center gap-4">
                      {slide.map((doctor) => (
                        <div
                          key={doctor.doctorID}
                          className="flex-shrink-0 w-80 bg-white rounded-lg"
                        >
                          <div className="text-center">
                            <div className="mb-4">
                              <img
                                className="rounded-5"
                                src={doctor.profilePicture}
                                alt={doctor.fullName}
                              />
                              <button
                                className="shadow-sm border-1 rounded-5 d-flex align-items-center mt-3 ctabtn bookappointment home-appointment_btn"
                                onClick={() => {
                                  dispatch(
                                    setBreadcrumb(["Home", "Book Appointment"])
                                  );
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                  navigate("/book-appointment");
                                }}
                              >
                                <span>
                                  <img src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758389743/agastya/circlearrow.svg" />
                                </span>{" "}
                                <span>Book Appointment</span>
                              </button>
                            </div>
                            <h3 className="f-20 mb-3 f-w-700 text-center">
                              {doctor.fullName}
                            </h3>
                            <p className="text-center text-muted f-16">
                              {doctor.designation}
                            </p>
                            <p className="text-center mb-2 text-muted f-16">
                              {doctor.qualification.join(", ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>

              <button
                className="absolute border-1 end-0 top-50 translate-middle-y bg-white p-4 rounded-circle shadow-sm z-10 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px", right: "-50px" }}
                onClick={handleNext}
              >
                <span className="f-40">→</span>
              </button>
            </>
          ) : (
            <div className="text-danger f-18 f-w-600 text-center">
              No Doctors Available
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;


