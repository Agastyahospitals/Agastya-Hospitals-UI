const axios = require("axios");
const templates = require("../utils/smsTemplates");
const eventMapper = require("../utils/smsEventMapper");
const replaceVars = require("../utils/replaceVars");

// Generic SMS sender
exports.sendSMS = async (req, res) => {
  try {
    const { eventType, mobileNumber } = req.body;

    if (!eventMapper[eventType]) {
      return res.status(400).json({ error: "Invalid eventType" });
    }

    const eventConfig = eventMapper[eventType];
    const template = templates[eventConfig.templateKey];

    const variables = eventConfig.buildVars(req.body);
    const message = replaceVars(template.text, variables);

    const url = `https://pgapi.vispl.in/fe/api/v1/send`;

    const params = {
      username: process.env.VISPL_USERNAME,
      password: process.env.VISPL_PASSWORD,
      unicode: false,
      from: process.env.VISPL_SENDER_ID,
      to: mobileNumber,
      dltContentId: template.dltContentId,
      dltPrincipalEntityId: process.env.VISPL_DLT_PE_ID,
      text: message
    };

    const response = await axios.get(url, { params });

    return res.json({
      success: true,
      eventType,
      providerResponse: response.data
    });

  } catch (err) {
    console.error("SMS ERROR:", err.response?.data || err.message);

        return res.status(500).json({
        success: false,
        error: err.response?.data || err.message
        });
    }
};