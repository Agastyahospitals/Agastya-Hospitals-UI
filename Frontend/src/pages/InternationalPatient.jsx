import React from "react";
import Patient from "./Patient";
import SEO from "../components/SEO";

const internationalPatientJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Agastya Hospitals - International Patient Services",
    "description": "World-class healthcare services for international patients at Agastya Hospitals, LB Nagar, Hyderabad. Personalized travel assistance, language support, and concierge services.",
    "url": "https://agastyahospitals.com/international-patient",
    "telephone": "+91-9459108108",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No. 1, Sagar Ring Road, Beside LB Nagar Metro Station",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500074",
      "addressCountry": "IN"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://agastyahospitals.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "International Patient",
        "item": "https://agastyahospitals.com/international-patient"
      }
    ]
  }
];

const InternationalPatient = () => {
  return (
    <>
      <SEO
        title="International Patient Services - World-Class Healthcare in Hyderabad"
        description="Agastya Hospitals offers world-class healthcare, personalized travel assistance, visa support, airport transfers, and language support for international patients visiting LB Nagar, Hyderabad."
        canonical="/international-patient"
        jsonLd={internationalPatientJsonLd}
      />
      <Patient />
    </>
  );
};

export default InternationalPatient;
