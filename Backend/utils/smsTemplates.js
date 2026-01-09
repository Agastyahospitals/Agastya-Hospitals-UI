module.exports = {
  REGISTRATION: {
    dltContentId: process.env.DLT_REGISTRATION_ID,
    text: "Dear {#var#}, Welcome to Agastya Hospitals. Your registration is successful. Use your registered mobile number to access our services. Thank you."
  },

  OTP_RESET: {
    dltContentId: process.env.DLT_OTP_RESET_ID,
    text: "Use OTP {#var#} to reset your password for Agastya Hospitals account. OTP is valid for 10 minutes. Please Do not share it with anyone."
  },

  APPOINTMENT: {
    dltContentId: process.env.DLT_APPOINTMENT_ID,
    text: "Dear {#var#}, your appointment is scheduled on {#var#} at {#var#}. Please bring your ID proof and insurance details. Thank you for choosing Agastya Hospitals."
  },

  REPORT_READY: {
    dltContentId: process.env.DLT_REPORT_READY_ID,
    text: "Dear {#var#}, your medical report for {#var#} is now available. Please log in to the Agastya Hospitals portal to view or download it. {#var#}"
  }
};