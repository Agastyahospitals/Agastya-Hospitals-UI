import { useState } from 'react'

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    {
      id: 0,
      question: "Where is Agastya Hospitals located in Hyderabad? ",
      answer: "Agastya Hospitals is located in LB Nagar, East Hyderabad, with easy access via metro and major roadways."
    },
    {
      id: 1,
      question: "Is Agastya Hospitals a multispecialty hospital?",
      answer: "Yes, we are a full-fledged multispecialty hospital offering comprehensive medical and surgical care."
    },
    {
      id: 2,
      question: "Does Agastya Hospitals provide 24/7 emergency services? ",
      answer: "Yes, our emergency and trauma care services operate round-the-clock."
    },
    {
      id: 3,
      question: "Are advanced surgeries performed at Agastya Hospitals?",
      answer: "Yes, we specialize in advanced and minimally invasive surgical procedures."
    },
    {
      id: 4,
      question: "Are treatments affordable at Agastya Hospitals?",
      answer: "We offer high-quality care at transparent and affordable pricing. "
    },
    {
      id: 5,
      question: "Can I book appointments online? ",
      answer: "Yes, appointments can be booked through phone or digital platforms. "
    },
    {
      id: 6,
      question: "Does Agastya Hospitals accept insurance? ",
      answer: "Yes, we work with major insurance providers and TPAs. "
    },
    {
      id: 7,
      question: "Do you offer post-treatment follow-ups? ",
      answer: "Yes, structured follow-up care is part of our treatment protocol. "
    },
    {
      id: 8,
      question: "Why choose Agastya Hospitals over other hospitals in Hyderabad? ",
      answer: "Our strength lies in ethical care, experienced doctors, affordability, and personalized attention."
    }
  ]

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? -1 : id)
  }

  return (
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

        {/* <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button className="btn-primary">
            Contact Us
          </button>
        </div> */}
      </div>
    </section>
  )
}

export default FAQSection 