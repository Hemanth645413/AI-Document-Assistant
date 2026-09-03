const supabase = require("../config/supabase");
const generateEmbedding = require("./embeddingService");

/**
 * Retrieve the most relevant chunks for a user question
 */
async function retrieveRelevantChunks(question, limit = 3) {

    try {

        // Generate embedding for the user's question
        const embedding = await generateEmbedding(question);

        // Call Supabase RPC function
        const { data, error } = await supabase.rpc(
            "match_document_chunks",
            {
                query_embedding: embedding,
                match_count: limit,
            }
        );

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return "";
        }

        return data
            .map(chunk => chunk.content)
            .join("\n\n");

    } catch (err) {

        console.error("RAG Error:");
        console.error(err);

        throw err;

    }

}

module.exports = retrieveRelevantChunks;