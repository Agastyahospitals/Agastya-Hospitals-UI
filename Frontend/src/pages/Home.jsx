import HeroSection from '../components/HeroSection'
import SpecialtiesSection from '../components/SpecialtiesSection'
import OutstandingCareSection from '../components/OutstandingCareSection'
import TechnologySection from '../components/TechnologySection'
import TestimonialsSection from '../components/TestimonialsSection'
import DoctorsSection from '../components/DoctorsSection'
import HealthPackagesSection from '../components/HealthPackagesSection'
import BlogSection from '../components/BlogSection'
import FAQSection from '../components/FAQSection'
import SEO from '../components/SEO'

const hospitalJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hospital",
  "name": "Agastya Hospitals",
  "description": "Agastya Hospitals is a leading super specialty hospital in LB Nagar, Hyderabad, offering advanced medical, surgical, and critical care services.",
  "url": "https://agastyahospitals.com",
  "telephone": "+91-9459108108",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "LB Nagar",
    "addressLocality": "Hyderabad",
    "addressRegion": "Telangana",
    "addressCountry": "IN"
  },
  "medicalSpecialty": [
    "Cardiology", "Orthopedics", "Neurology", "Gastroenterology",
    "Pulmonology", "Nephrology", "Urology", "General Surgery"
  ],
  "availableService": {
    "@type": "MedicalProcedure",
    "name": "Super Specialty Medical Care"
  }
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where is Agastya Hospitals located in Hyderabad?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Agastya Hospitals is located in LB Nagar, East Hyderabad, with easy access via metro and major roadways."
      }
    },
    {
      "@type": "Question",
      "name": "Is Agastya Hospitals a multispecialty hospital?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we are a full-fledged multispecialty hospital offering comprehensive medical and surgical care."
      }
    },
    {
      "@type": "Question",
      "name": "Does Agastya Hospitals provide 24/7 emergency services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our emergency and trauma care services operate round-the-clock."
      }
    },
    {
      "@type": "Question",
      "name": "Are advanced surgeries performed at Agastya Hospitals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we specialize in advanced and minimally invasive surgical procedures."
      }
    },
    {
      "@type": "Question",
      "name": "Are treatments affordable at Agastya Hospitals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer high-quality care at transparent and affordable pricing."
      }
    },
    {
      "@type": "Question",
      "name": "Can I book appointments online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, appointments can be booked through phone or digital platforms."
      }
    },
    {
      "@type": "Question",
      "name": "Does Agastya Hospitals accept insurance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we work with major insurance providers and TPAs."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer post-treatment follow-ups?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, structured follow-up care is part of our treatment protocol."
      }
    },
    {
      "@type": "Question",
      "name": "Why choose Agastya Hospitals over other hospitals in Hyderabad?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our strength lies in ethical care, experienced doctors, affordability, and personalized attention."
      }
    }
  ]
};

const Home = () => {
  return (
    <div>
      <SEO
        title="Best Super Specialty Hospital in LB Nagar, Hyderabad"
        description="Agastya Hospitals is a leading super specialty hospital in LB Nagar, Hyderabad offering comprehensive medical, surgical, and critical care services with experienced specialists."
        canonical="/"
        jsonLd={[hospitalJsonLd, faqJsonLd]}
      />
      <HeroSection />
      <SpecialtiesSection />
      <TechnologySection />
      <OutstandingCareSection />
      {/* <TestimonialsSection /> */}
      <DoctorsSection />
      <HealthPackagesSection />
      <BlogSection />
      <FAQSection />
    </div>
  )
}

export default Home 