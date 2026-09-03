const axios = require("axios");

// LiteLLM Proxy URL
const litellm = axios.create({
    baseURL:
        process.env.LITELLM_URL ||
        "http://localhost:4000",

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LITELLM_MASTER_KEY}`,
    },

    timeout: 120000,
});

module.exports = litellm;