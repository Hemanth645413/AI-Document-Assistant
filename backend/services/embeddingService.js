const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate embedding for a text chunk
 */
async function generateEmbedding(text) {
    try {
        if (!text || !text.trim()) {
            return null;
        }

        const response = await ai.models.embedContent({
            model: "gemini-embedding-2",
            contents: text,
        });

        return response.embeddings[0].values;

    } catch (error) {
        console.error("Embedding Error:");
        console.error(error);

        throw error;
    }
}

module.exports = generateEmbedding;