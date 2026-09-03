/**
 * Split document into overlapping chunks
 * for Retrieval-Augmented Generation (RAG)
 */

function chunkText(text, chunkSize = 1000, overlap = 200) {

    if (!text || typeof text !== "string") {
        return [];
    }

    // Validate settings
    if (chunkSize <= 0) {
        throw new Error("chunkSize must be greater than 0.");
    }

    if (overlap < 0 || overlap >= chunkSize) {
        throw new Error(
            "overlap must be greater than or equal to 0 and smaller than chunkSize."
        );
    }

    // Clean text
    text = text
        .replace(/\r/g, "")
        .replace(/\n{2,}/g, "\n")
        .trim();

    if (!text) {
        return [];
    }

    const chunks = [];

    let start = 0;

    while (start < text.length) {

        let end = Math.min(
            start + chunkSize,
            text.length
        );

        let chunk = text.substring(start, end);

        // Try to end at a sentence
        if (end < text.length) {

            const lastPeriod =
                chunk.lastIndexOf(".");

            if (lastPeriod > 500) {

                chunk = chunk.substring(
                    0,
                    lastPeriod + 1
                );

                end =
                    start +
                    lastPeriod +
                    1;
            }
        }

        chunks.push({
            chunk_index: chunks.length,
            content: chunk.trim(),
        });

        // =====================================
        // IMPORTANT: Stop when final chunk reached
        // =====================================

        if (end >= text.length) {
            break;
        }

        // Move forward with overlap
        const nextStart = end - overlap;

        // Safety check to prevent infinite loop
        if (nextStart <= start) {
            break;
        }

        start = nextStart;
    }

    return chunks;
}

module.exports = chunkText;