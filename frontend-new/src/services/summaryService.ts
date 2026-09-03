import axios from "axios";

const API_URL = "http://localhost:5000/api/chat";

export async function generateSummary(documentId: string) {
    try {
        console.log("📝 Generating summary for document:", documentId);

        const response = await axios.post(
            `${API_URL}/summary`,
            {
                documentId,
            }
        );

        console.log("✅ Summary API Response:", response.data);

        return response.data;

    } catch (error: any) {
        console.error("❌ Summary API Error:", error);

        let errorMessage = "Summary generation failed.";

        // Backend returned a response
        if (error.response?.data) {
            const data = error.response.data;

            // Example:
            // { success: false, error: "Document not found." }
            if (typeof data.error === "string") {
                errorMessage = data.error;
            }

            // Error itself is an object
            else if (data.error) {
                errorMessage = JSON.stringify(data.error);
            }

            // Backend returned a string
            else if (typeof data === "string") {
                errorMessage = data;
            }

            // Any other response object
            else {
                errorMessage = JSON.stringify(data);
            }
        }

        // Axios/network error
        else if (error.message) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}