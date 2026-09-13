import React from 'react'
import SEO from '../components/SEO'

const MedicalReports = () => {
  return (
    <div>
      <SEO
        title="Medical Reports Portal"
        description="Patient medical reports access portal for Agastya Hospitals."
        canonical="/medical-reports"
        robots="noindex, nofollow"
      />
      <div className="container py-5">
        <h2>Medical Reports Portal</h2>
        <p>Access your lab results, diagnostic imaging, and medical reports online.</p>
      </div>
    </div>
  )
}

export default MedicalReports