const axios = require("axios");

// =====================================================
// Local LiteLLM
// =====================================================

const localLiteLLM = axios.create({
    baseURL:
        process.env.LITELLM_URL ||
        "http://localhost:4000",

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
            `Bearer ${process.env.LITELLM_MASTER_KEY}`,
    },

    timeout: 120000,
});


// =====================================================
// Direct Gemini API
// =====================================================

async function callGemini(config) {
    const {
        messages,
        temperature = 0.7,
        max_tokens = 2000,
    } = config;

    const systemMessages = messages
        .filter((msg) => msg.role === "system")
        .map((msg) => msg.content)
        .join("\n\n");

    const userMessages = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => msg.content)
        .join("\n\n");

    const prompt = systemMessages
        ? `${systemMessages}\n\n${userMessages}`
        : userMessages;

    const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
        {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature,
                maxOutputTokens: max_tokens,
            },
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                key: process.env.GEMINI_API_KEY,
            },
            timeout: 120000,
        }
    );

    const text =
        response.data?.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("") || "";

    return {
        data: {
            choices: [
                {
                    message: {
                        content: text,
                    },
                },
            ],
        },
    };
}


// =====================================================
// Direct Groq API
// =====================================================

async function callGroq(config) {
    const {
        messages,
        temperature = 0.7,
        max_tokens = 2000,
    } = config;

    return axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "openai/gpt-oss-20b",
            messages,
            temperature,
            max_tokens,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    `Bearer ${process.env.GROQ_API_KEY}`,
            },
            timeout: 120000,
        }
    );
}


// =====================================================
// Smart AI Router
// =====================================================

module.exports = {

    async post(url, config) {

        // ---------------------------------------------
        // If LITELLM_URL is configured,
        // use LiteLLM.
        //
        // This keeps your local Docker setup working.
        // ---------------------------------------------

        if (process.env.LITELLM_URL) {

            return localLiteLLM.post(
                url,
                config
            );
        }


        // ---------------------------------------------
        // Render / Production
        //
        // No LITELLM_URL means use direct APIs.
        // ---------------------------------------------

        const model =
            (config.model || "").toLowerCase();


        // Gemini
        if (
            model.includes("gemini") ||
            model === "gemini-flash"
        ) {

            return callGemini(config);
        }


        // Groq
        if (
            model.includes("groq") ||
            model.includes("llama") ||
            model.includes("deepseek")
        ) {

            return callGroq(config);
        }


        // Default
        return callGroq(config);
    },
};