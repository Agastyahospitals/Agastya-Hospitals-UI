module.exports = {
  USER_REGISTERED: {
    templateKey: "REGISTRATION",
    buildVars: (body) => [body.name]
  },

  OTP_RESET: {
    templateKey: "OTP_RESET",
    buildVars: (body) => [body.otp]
  },

  APPOINTMENT_BOOKED: {
    templateKey: "APPOINTMENT",
    buildVars: (body) => [
      body.name,
      body.date,
      body.time
    ]
  },

  REPORT_READY: {
    templateKey: "REPORT_READY",
    buildVars: (body) => [
      body.name,
      body.reportName,
      body.downloadUrl
    ]
  }
};