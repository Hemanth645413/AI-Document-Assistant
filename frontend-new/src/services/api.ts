import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 180000, // 3 minutes (for image generation)
});

export default API;