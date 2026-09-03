const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Prompt is required."
            });
        }

        console.log("====================================");
        console.log("🖼️ AI Image Generation");
        console.log("Prompt:", prompt);
        console.log("====================================");

        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
            {
                prompt: prompt
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer",
                timeout: 180000
            }
        );

        const image = Buffer.from(response.data).toString("base64");

        console.log("✅ Image Generated Successfully");

        res.json({
            success: true,
            image: `data:image/png;base64,${image}`
        });

    } catch (err) {

        console.log("====================================");
        console.log("❌ IMAGE GENERATION ERROR");
        console.log(
            err.response?.data
                ? Buffer.from(err.response.data).toString()
                : err.message
        );
        console.log("====================================");

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;