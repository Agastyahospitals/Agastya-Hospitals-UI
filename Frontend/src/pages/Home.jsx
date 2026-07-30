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

const Home = () => {
  return (
    <div>
      <SEO
        title="Best Super Specialty Hospital in LB Nagar, Hyderabad"
        description="Agastya Hospitals is a leading super specialty hospital in LB Nagar, Hyderabad offering comprehensive medical, surgical, and critical care services with experienced specialists."
        canonical="/"
        jsonLd={hospitalJsonLd}
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