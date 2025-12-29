import React from "react";
import LightGallery from "lightgallery/react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";

const AwardsAndRecongnition = () => {
  return (
    <div>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">Awards & Recognitions</h2>
          </div>
        </div> 
        
        <div className="container awards-gallery">
          <div className="row">
            <div className="col-lg-12 f-20 text-center mb-3 f-w-600">Agastya Hospitals is Awarded for Excellence in Advanced Medical Care At Times Icons of Healthcare 2025. </div>
            <LightGallery plugins={[lgZoom, lgThumbnail]} speed={500}>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-1.png">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1763311013/agastya/awards-thumb-1.png"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-2.png">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1763310993/agastya/awards-thumb-2.png"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-3.png">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1763310994/agastya/awards-thumb-3.png"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-4.png">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1763311007/agastya/awards-thumb-4.png"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-5.png">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1763311009/agastya/awards-thumb-5.png"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-6.png">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1763310994/agastya/awards-thumb-6.png"
                  alt="…"
                />
              </a>
              {/* <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-7.png">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1763310993/agastya/awards-thumb-7.png"
                  alt="…"
                />
              </a> */}

              {/* more items */}
            </LightGallery>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AwardsAndRecongnition;
