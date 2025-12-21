import { useState } from 'react'

const Patient = () => {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    {
      id: 0,
      question: "Does Agastya Hospitals treat international patients? ",
      answer: "Yes, we have a dedicated International Patient Services team. "
    },
    {
      id: 1,
      question: "What support is provided before travel? ",
      answer: "We provide medical opinions, treatment plans, and cost estimates before travel. "
    },
    {
      id: 2,
      question: "Is visa assistance available? ",
      answer: "Yes, we assist with medical visa documentation. "
    },
    {
      id: 3,
      question: "Are interpreters available for international patients? ",
      answer: "English-speaking coordinators are available; language support can be arranged if required. "
    },
    {
      id: 4,
      question: "How affordable is treatment compared to other countries? ",
      answer: "Treatments are 30–60% more affordable compared to Western nations.  "
    },
    {
      id: 5,
      question: "Do doctors at Agastya Hospitals have international experience? ",
      answer: "Yes, many of our doctors have global training and exposure. "
    },
    {
      id: 6,
      question: "Is post-treatment follow-up available after returning home? ",
      answer: "Yes, tele-consultation and follow-ups are provided. "
    },
    {
      id: 7,
      question: "Do you assist with accommodation? ",
      answer: "Yes, we help arrange nearby accommodation for patients and attendants. "
    },
    {
      id: 8,
      question: "How long is the typical hospital stay? ",
      answer: "Hospital stay depends on the treatment; our team ensures optimized recovery timelines. "
    },
    {
      id: 9,
      question: "Why choose Agastya Hospitals instead of large hospital chains? ",
      answer: "We offer personalized care, faster access to doctors, ethical opinions, and cost transparency. "
    }
  ]

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? -1 : id)
  }
  return (
<div className="py-5">
  <div className="container px-3 international-patient-page">
    
    
    <div className="row">
      <div className="col-lg-10 m-auto">
        <p className="text-center">Agastya Hospitals, stands as a beacon of excellence in healthcare, attracting patients worldwide seeking world-class medical expertise. Rooted in a city celebrated for its legacy of medical mastery, our facility combines cutting-edge technology with compassionate, personalized care. Experience advanced treatment in a sanctuary of comfort and understanding, where every patient receives dedicated attention. We are honored to serve humanity with unwavering commitment, ensuring exceptional outcomes through innovation and empathy.</p>
      </div>
    </div>

    <div className='row intl-appointmentform'>
      <div className='col-lg-12 bgcolor'>
        <div className='row'>
          <div className='col-lg-8'>

          </div>
            <div className='col-lg-4'>
        <form className="booking-form-container bg-light border-none">
      <div className="booking-form-group">
        <h2 className="booking-form-title">International Patients Enquiry Form</h2>
        <label className="booking-form-label" htmlFor="fullName">
          Full Name
        </label>
        <input
          className="booking-form-input"
          type="text"
          id="fullName"
          name="fullName"
          value=""
          placeholder="Enter full name"
        />
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="mobileNumber">
          Mobile Number
        </label>
        <input
          className="booking-form-input"
          type="text"
          id="mobileNumber"
          name="mobileNumber"
          value=""
          placeholder="Enter phone number"
        />
      </div>
      <div className="booking-form-group">
        <input
          id="isWhatsApp"
          type="checkbox" />
        <label className="f-12" htmlFor="isWhatsApp">
          This is my WhatsApp number
        </label>
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="email">
          Email
        </label>
        <input
          className="booking-form-input"
          type="email"
          id="email"
          name="email"
          value=""
          placeholder="Enter email address"
        />
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="message">
          Message
        </label>
        <textarea
          className="booking-form-textarea"
          id="message"
          name="message"
          rows="4"
          value=""
          placeholder="Enter your query"
        />
        
      </div>
      <div className="booking-form-group mb-3">
        <input
          id="agreePolicy"
          type="checkbox" />
        <label className="f-12" htmlFor="agreePolicy">
          I agree to the Terms & Conditions and Privacy Policy.
        </label>
      </div>
      <button
        type="submit"
        className="rounded-5 btn btn-secondary btn-primary submitbtn"
        
      >
        Submit Request
      </button>
    </form>
      </div>
        </div>
      </div>
    
    </div>


    <div className="row whychoose-agastya">
      <div className="content">
        <div className="row">
          <div class="col-lg-12 text-center mb-12"><h2 class="main-title-center">Why Choose Agastya</h2></div>
          <div class="col-lg-12 text-center mb-"><p className="text-center">At Agastya Hospital, your path to complete healing begins with world-class medical professionals who center your comfort and well-being.</p></div>
        </div>
        <div className="row">
          <div className="col-lg-3 gridcontent">
            <img src="https://ik.imagekit.io/sandy143/specialities/icon/vaccine_HsEPp-krV.png"/>
            <p>Healthcare within Reach</p>
          </div>
          <div className="col-lg-3 gridcontent">
            <img src="https://ik.imagekit.io/sandy143/specialities/icon/vaccine_HsEPp-krV.png"/>
            <p>Healthcare within Reach</p>
          </div>
          <div className="col-lg-3 gridcontent">
            <img src="https://ik.imagekit.io/sandy143/specialities/icon/vaccine_HsEPp-krV.png"/>
            <p>Healthcare within Reach</p>
          </div>
          <div className="col-lg-3 gridcontent">
            <img src="https://ik.imagekit.io/sandy143/specialities/icon/vaccine_HsEPp-krV.png"/>
            <p>Healthcare within Reach</p>
          </div>
        </div>
      </div>
    </div>
    <div className="row intl-patient-stories">
      <div className="content">
        <div className="row">
          <div class="col-lg-12 text-center mb-12"><h2 class="main-title-center">Patient Stories</h2></div>
        </div>
        <div className="row">
          <div class="col-lg-3">
            <div className="story-card">
              <img src="https://placehold.co/600x400/EEE/31343C" alt="Doctor with patient" />
              <div class="card-body">
                <h5 class="card-title fw-bold">
                A Life-Changing Tumor Surgery of Mrs. Jane Doe
                </h5>
                <a href="#" class="btn btn-outline-primary btn-video mt-2">
                  <span class="play-icon">▶</span>
                  Watch Video
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div className="story-card">
              <img src="https://placehold.co/600x400/EEE/31343C" alt="Doctor with patient" />
              <div class="card-body">
                <h5 class="card-title fw-bold">
                A Life-Changing Tumor Surgery of Mrs. Jane Doe
                </h5>
                <a href="#" class="btn btn-outline-primary btn-video mt-2">
                  <span class="play-icon">▶</span>
                  Watch Video
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div className="story-card">
              <img src="https://placehold.co/600x400/EEE/31343C" alt="Doctor with patient" />
              <div class="card-body">
                <h5 class="card-title fw-bold">
                A Life-Changing Tumor Surgery of Mrs. Jane Doe
                </h5>
                <a href="#" class="btn btn-outline-primary btn-video mt-2">
                  <span class="play-icon">▶</span>
                  Watch Video
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div className="story-card">
              <img src="https://placehold.co/600x400/EEE/31343C" alt="Doctor with patient" />
              <div class="card-body">
                <h5 class="card-title fw-bold">
                A Life-Changing Tumor Surgery of Mrs. Jane Doe
                </h5>
                <a href="#" class="btn btn-outline-primary btn-video mt-2">
                  <span class="play-icon">▶</span>
                  Watch Video
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="row intl-faqs-section pt-5 mt-5">       
           <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="main-title-center mb-12">FAQs</h2>
        </div>
      </div>
      <div className="container mx-auto px-4">
       
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <span className={`text-2xl transition-transform duration-200 ${
                  openFAQ === faq.id ? 'rotate-45' : ''
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
</div>
  );
};

export default Patient;