const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate embedding for a text chunk
 * Includes automatic retry for Gemini rate-limit errors (429)
 */
async function generateEmbedding(text) {
    const maxRetries = 3;

    if (!text || !text.trim()) {
        return null;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(
                `🧠 Generating embedding (attempt ${attempt}/${maxRetries})`
            );

            const response = await ai.models.embedContent({
                model: "gemini-embedding-2",
                contents: text,
            });

            const embedding =
                response?.embeddings?.[0]?.values;

            if (!embedding) {
                throw new Error(
                    "Gemini did not return an embedding."
                );
            }

            console.log(
                `✅ Embedding generated (${embedding.length} dimensions)`
            );

            return embedding;

        } catch (error) {
            const status =
                error.status ||
                error.response?.status;

            console.error(
                `❌ Embedding attempt ${attempt} failed:`,
                error.message
            );

            // Retry only when Gemini rate-limits the request
            if (status === 429 && attempt < maxRetries) {
                const delay = attempt * 5000;

                console.log(
                    `⏳ Rate limit detected. Waiting ${delay / 1000} seconds before retry...`
                );

                await new Promise((resolve) =>
                    setTimeout(resolve, delay)
                );

                continue;
            }

            // For non-429 errors or after all retries fail
            console.error("Embedding Error Details:");
            console.error(error);

            throw error;
        }
    }
}

module.exports = generateEmbedding;