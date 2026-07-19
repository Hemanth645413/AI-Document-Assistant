import axios from "axios";

const API = axios.create({
    baseURL: "https://ai-document-assistant-igep.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;