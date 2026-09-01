
// import aboutagstya from "../assets/images/about-agastya.png";

import { OutstandingCareSectionImages } from "../assets/ImageConstants"


const OutstandingCareSection = () => {
  return (
    <section className="outstanding-care">

      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="left-section">
              <img src={OutstandingCareSectionImages.aboutagstya} alt="Outstanding Care"></img>
              <div className="d-flex mt-5 mx-auto justify-center outstanding-btn-container">
                <a href="#" className="video"><img height={24} src="https://res.cloudinary.com/sdk28cdn/image/upload/v1758302379/agastya/video-icon.svg"></img> Watch Video</a>
    
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="right-section">
              <h2 className="main-title">We're known for outstanding Care</h2>
              <p className="paragraph-18 mb-5">
                Agastya Hospitals, is a 150 bedded hospital located on converge of 5 most important routes of twin cities, situated at Omakar Nagar, Nagarjuna Sagar Road, L B Nagar, Hyderabad. The project was conceived by 4 of the most enterprising Medical Professionals of the City.
              </p>

              <ul className="list-items">
                <li>Highly qualified team of doctors and specialists</li>
                <li>State-of-the-art facilities and cutting-edge technology </li>
                <li>Commitment to affordable and accessible for all</li>
              </ul>
            </div>
            <div className="accreditation">
              <div className="background"></div>
              <div className="accreds"><p className="paragraph-22 p-3 f-w-700">Accreditation <br />& Recognition</p><img src={OutstandingCareSectionImages.accreditation}></img></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OutstandingCareSection 