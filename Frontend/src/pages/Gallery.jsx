/*import React from 'react'
const Gallery = () => {
  return (
    <div>Gallery</div>
  )
}
export default Gallery;*/

import React, { useState } from "react";
import LightGallery from "lightgallery/react";

// LightGallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import arthroscopy from "../assets/images/gallery/arthroscopy.png";
import cathlab from "../assets/images/gallery/cathlab.png";
import robotics from "../assets/images/gallery/robotics.png";
import ctscan from "../assets/images/gallery/ct-scan.png";
import galone from"../assets/images/gallery/agastyagallery-1.png";
import galtwo from "../assets/images/gallery/agastyagallery-2.png";
import galthree from "../assets/images/gallery/agastyagallery-3.png";
import galfour from "../assets/images/gallery/agastyagallery-4.png";
import galfive from "../assets/images/gallery/agastyagallery-5.png";
import galsix from "../assets/images/gallery/agastyagallery-6.png";
import galseven from "../assets/images/gallery/agastyagallery-7.png";
import galeight from "../assets/images/gallery/agastyagallery-8.png";
import galnine from "../assets/images/gallery/agastyagallery-9.png";
import galten from "../assets/images/gallery/agastyagallery-10.png";
import galeleven from "../assets/images/gallery/agastyagallery-11.png";
import galtwelve from "../assets/images/gallery/agastyagallery-12.png";
import galthirteen from "../assets/images/gallery/agastyagallery-13.png";
import galfourteen from "../assets/images/gallery/agastyagallery-14.png";
import galfifteen from "../assets/images/gallery/agastyagallery-15.png";
import galsixteen from "../assets/images/gallery/agastyagallery-16.png";
import galseventeen from "../assets/images/gallery/agastyagallery-17.png";
import galeighteen from "../assets/images/gallery/agastyagallery-18.png";
import galninghteen from "../assets/images/gallery/agastyagallery-19.png";
import galtwenty from "../assets/images/gallery/agastyagallery-20.png";

const Gallery = () => {
  // Tabs and their image sets
  const tabs = {
    Infrastructure: [
{ src: galone, thumb: galone, caption: "Gallery Image" },
{ src: galtwo, thumb: galtwo, caption: "Gallery Image" },
{ src: galthree, thumb: galthree, caption: "Gallery Image" },
{ src: galfour, thumb: galfour, caption: "Gallery Image" },
{ src: galfive, thumb: galfive, caption: "Gallery Image" },
{ src: galsix, thumb: galsix, caption: "Gallery Image" },
{ src: galseven, thumb: galseven, caption: "Gallery Image" },
{ src: galeight, thumb: galeight, caption: "Gallery Image" },
{ src: galnine, thumb: galnine, caption: "Gallery Image" },
{ src: galten, thumb: galten, caption: "Gallery Image" },
{ src: galeleven, thumb: galeleven, caption: "Gallery Image" },
{ src: galtwelve, thumb: galtwelve, caption: "Gallery Image" },
{ src: galthirteen, thumb: galthirteen, caption: "Gallery Image" },
{ src: galfourteen, thumb: galfourteen, caption: "Gallery Image" },
{ src: galfifteen, thumb: galfifteen, caption: "Gallery Image" },
{ src: galsixteen, thumb: galsixteen, caption: "Gallery Image" },
{ src: galseventeen, thumb: galseventeen, caption: "Gallery Image" },
{ src: galeighteen, thumb: galeighteen, caption: "Gallery Image" },
{ src: galninghteen, thumb: galninghteen, caption: "Gallery Image" },
{ src: galtwenty, thumb: galtwenty, caption: "Gallery Image" },
      /*{
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-1.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-1.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468045/agastya/agastya-gallery-2.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468045/agastya/agastya-gallery-2.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468092/agastya/agastya-gallery-3.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468092/agastya/agastya-gallery-3.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-4.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-4.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468073/agastya/agastya-gallery-5.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468073/agastya/agastya-gallery-5.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-6.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-6.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-7.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-7.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-8.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-8.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-9.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-9.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-10.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-10.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-11.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-11.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-12.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-12.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-13.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-13.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-14.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-14.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-15.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-15.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-16.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-16.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-17.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-17.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-18.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-18.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-19.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-19.jpg",
        caption: "Infrastructure",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-20.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-20.jpg",
        caption: "Infrastructure",
      },*/
    ],

    Equipment: [
      { src: arthroscopy, thumb: arthroscopy, caption: "Arthroscopy" },
       { src: ctscan, thumb: ctscan, caption: "CTScan" },
        { src: cathlab, thumb: cathlab, caption: "Cathlab" },
         { src: robotics, thumb: robotics, caption: "Robotics" },
     /* {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/robotics.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/robotics.jpg",
        caption: "Robotics",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/ct_scan.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/ct_scan.jpg",
        caption: "CT Scan",
      },
      {
        src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468101/agastya/arthroscopy.jpg",
        thumb:
          "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468101/agastya/arthroscopy.jpg",
        caption: "Arthroscopy",
      },*/
    ],
    // Architecture: [
    //   { src: "https://picsum.photos/id/1003/1200/800", thumb: "https://picsum.photos/id/1003/600/400", caption: "Building" },
    //   { src: "https://picsum.photos/id/1008/1200/800", thumb: "https://picsum.photos/id/1008/600/400", caption: "Cityscape" },
    //   { src: "https://picsum.photos/id/1012/1200/800", thumb: "https://picsum.photos/id/1012/600/400", caption: "Museum" },
    // ],
  };

  const [activeTab, setActiveTab] = useState("Infrastructure");

  return (
    <div className="container mt-5 mb-5">
      {/* --- Tabs --- */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              margin: "5px",
              border: "1px",
              borderStyle: "solid",
              borderRadius: "50px",
              cursor: "pointer",
              background: activeTab === tab ? "#1a365a" : "#fff",
              color: activeTab === tab ? "#fff" : "#333",
              transition: "0.3s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- Gallery --- */}
      <LightGallery
        key={activeTab}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        elementClassNames="gallery-grid"
      >
        {tabs[activeTab].map((img, i) => (
          <a key={i} href={img.src} data-sub-html={`<h4>${img.caption}</h4>`}>
            <img
              src={img.thumb}
              alt={img.caption}
              loading="lazy"
              style={{
                width: "100%",
                display: "block",
                borderRadius: "8px",
                marginBottom: "15px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </a>
        ))}
      </LightGallery>

      {/* --- Inline CSS for Masonry layout --- */}
      <style jsx>{`
        .gallery-grid {
          column-count: 3;
          column-gap: 15px;
        }

        @media (max-width: 900px) {
          .gallery-grid {
            column-count: 2;
          }
        }

        @media (max-width: 600px) {
          .gallery-grid {
            column-count: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Gallery;
