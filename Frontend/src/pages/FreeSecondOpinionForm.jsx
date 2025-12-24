import React, { useState } from "react";
import EnquiryForm from "./EnquiryForm";
import { freeSecondOpinionFaqs } from "../components/common/FAQs";

const initialState = {
  fullName: "",
  email: "",
  mobileNumber: "",
  message: "",
  agreePolicy: false,
  isWhatsApp: false,
};

const FreeSecondOpinionForm = () => {
  const [formState, setFormState] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [openFAQ, setOpenFAQ] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formState.fullName) newErrors.name = "Name is required";
    if (!formState.email) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!formState.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10}$/.test(formState.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit phone number";
    if (!formState.message) newErrors.message = "Please describe your case";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      // Here you would send the form data to your backend
    }
  };

  const isFormInvalid = () => {
    const requiredFields = ["fullName", "mobileNumber", "email", "agreePolicy"];
    return requiredFields.some(
      (field) =>
        formState[field] === null ||
        formState[field] === undefined ||
        formState[field] === "" ||
        (typeof formState[field] === "boolean" && formState[field] === false)
    );
  };

  const toggleFAQ = (id) => {
    if (openFAQ === id) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(id);
    }
  };

  return (
    <div className="container p-5 opinion-form">
      <div className="row">
        <div className="col-lg-5">
          {/* <p className="mb-6">
            Fill out the form below and our specialists will review your case
            and get back to you as soon as possible.
          </p> */}
          {submitted ? (
            <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
              Thank you for submitting your request! Our team will contact you
              soon.
            </div>
          ) : (
            <EnquiryForm formType="Second Opinion Form" />
          )}
        </div>

        <div className="col-lg-7">
          <h2 className="paragraph-28 f-w-900 my-4">
            Why should you get a second opinion?
          </h2>
          <p className="mb-4">
            Receiving a serious diagnosis or being advised surgery can be overwhelming. At Agastya Hospitals, LB Nagar, Hyderabad, we strongly believe that every patient has the right to clarity, confidence, and choice. Our Second Opinion service empowers patients to make informed healthcare decisions by validating diagnoses, treatment plans, and surgical recommendations through expert medical review.
          </p>

          <p>
            A second opinion can often confirm the initial diagnosis, suggest alternative treatments, or identify less invasive and more cost-effective options — without delay or pressure.
          </p>

          <h2 className="h2-title mt-5">Why a Second Opinion Matters in Medical Decision-Making</h2>
          <p>Medical conditions can be complex, and treatment approaches may vary between doctors and hospitals. Seeking a second opinion ensures:</p>
          <ul className="list-item-disc">
            <li>Confirmation of diagnosis</li>
            <li>Validation of recommended surgery or procedure</li>

            <li>Awareness of non-surgical or minimally invasive alternatives</li>

            <li>Better understanding of risks, recovery, and outcomes</li>

            <li>Confidence before proceeding with treatment</li>
          </ul>

          <p>At Agastya Hospitals, we provide <b>ethical, unbiased, and evidence-based second opinions</b> to help patients and families choose what is truly best for their health.</p>



          <h2 className="h2-title mt-5">When Should You Consider a Second Opinion?</h2>
          <h3 className="h3-title">Common Situations Where a Second Opinion is Recommended</h3>
          <p>You should consider a second medical opinion if:</p>

          <ul className="list-item-disc">
            <li>You have been advised major or high-risk surgery</li>
            <li>Your condition is chronic, rare, or worsening</li>
            <li>Multiple treatment options exist and you are unsure which to choose</li>
            <li>You are not comfortable with the diagnosis or explanation given</li>
            <li>Treatment costs or duration seem unclear</li>
            <li>You want reassurance before starting long-term treatment</li>
          </ul>

          <p className="f-w-600">A second opinion is not a sign of mistrust — it is a responsible and proactive healthcare decision.</p>





          <h2 className="h2-title mt-5">Second Opinion Services at Agastya Hospitals</h2>
          <p>Agastya Hospitals offers expert second opinions across major medical and surgical specialties, supported by advanced diagnostics and multidisciplinary consultation.</p>
          <h3 className="h3-title">Specialties Covered for Second Opinions</h3>

          <ul className="list-item-disc">
            <li>Orthopaedics & Joint Replacement</li>
            <li>Spine & Trauma Care</li>
            <li>Neurology & Neurosurgery</li>
            <li>Cardiology</li>
            <li>General & Laparoscopic Surgery</li>
            <li>Gastroenterology</li>
            <li>Urology & Nephrology</li>
            <li>Pulmonology</li>
            <li>Gynaecology & Women’s Health</li>
            <li>Internal Medicine</li>
          </ul>

          <p className="f-w-600">Each case is reviewed by experienced senior consultants who focus on accuracy, safety, and long-term patient outcomes.</p>






          <h2 className="h2-title mt-5">How Our Second Opinion Process Works</h2>

          <h3 className="h3-title">Step-by-Step Approach:</h3>
          <p class="mb-3"><b>1.Share Medical Records</b><br />
            Submit your reports, scans, prescriptions, and diagnostic results.</p>
          <p class="mb-3"><b>2.Expert Clinical Review</b>
            Our specialists thoroughly evaluate your medical history and findings.</p>

          <p class="mb-3"><b>3.Discussion & Clarification</b>
            We explain the diagnosis, treatment options, and alternatives in clear, simple language.</p>

          <p class="mb-3"><b>4.Personalized Medical Advice</b>
            You receive a transparent and unbiased second opinion tailored to your condition.</p>

          <p class="mb-3"><b>Next-Step Guidance</b>
            We help you decide whether to proceed with treatment, seek further evaluation, or explore conservative care.</p>




          <h2 className="h2-title mt-5">Why Choose Agastya Hospitals for a Second Opinion in Hyderabad?</h2>
          <p>Agastya Hospitals is recognized for ethical clinical practices and patient-first care, especially for patients seeking clarity before major medical decisions.</p>

          <h3 className="h3-title">Our Key Strengths</h3>
          <ul class="list-item-disc">
            <li>Senior doctors with extensive clinical experience</li>
            <li>Honest, unbiased medical opinions</li>
            <li>No pressure for immediate treatment or surgery</li>
            <li>Affordable consultation costs</li>
            <li>Quick turnaround time</li>
            <li>Easy access from LB Nagar and East Hyderabad</li>
          </ul>

          <p>Unlike large hospital chains, we prioritize individual attention, transparency, and trust.</p>


          <h2 className="h2-title mt-5">Online & In-Person Second Opinions Available</h2>
          <h3 class="h3-title">Online Second Opinion</h3>
          <p>Patients can share reports digitally and consult our specialists remotely — ideal for patients outside Hyderabad or seeking quick guidance.</p>
          <h3 class="h3-title">In-Hospital Second Opinion</h3>
          <p>Visit Agastya Hospitals in LB Nagar for face-to-face consultation, physical examination, and advanced diagnostic review if required.</p>


          <h2 className="h2-title mt-5">Who Can Benefit from a Second Opinion?</h2>

          <ul class="list-item-disc">
            <li>Patients advised surgery</li>
            <li>Elderly patients with multiple health conditions</li>
            <li>Patients with recurring symptoms</li>
            <li>Individuals seeking cost-effective treatment alternatives</li>
            <li>International patients seeking treatment in India</li>
          </ul>
          <p>A second opinion often leads to better outcomes, reduced anxiety, and informed consent.</p>


          <h2 className="h2-title mt-5">Commitment to Ethical & Patient-Centric Care</h2>
          <p>At Agastya Hospitals, our second opinion service is guided by medical ethics, transparency, and compassion. We respect the opinions of other doctors while ensuring patients receive clear, medically sound advice without commercial bias.</p>







          {/* <p className="f-14 text-danger">
            The free second opinion service is available exclusively for online
            inquiries.
            <br />
            Please complete the form to continue.
          </p> */}
        </div>
      </div>


      <div className="row intl-faqs-section mt-5">

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="main-title-center mb-12">FAQs – Get a Second Opinion at Agastya Hospitals</h2>
            </div>
          </div>
          <div className="container mx-auto px-4">

            <div className="max-w-4xl mx-auto">
              {freeSecondOpinionFaqs.map((faq) => (
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

export default FreeSecondOpinionForm;
