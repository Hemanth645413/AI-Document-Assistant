const axios = require("axios");

const litellm = axios.create({
    baseURL: "http://localhost:16982",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 60000,
});

module.exports = litellm;