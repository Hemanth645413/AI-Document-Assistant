import axios from "axios";

const API_URL = "http://localhost:5000/api/chat";

export async function generateDiagram(documentId: string) {

    try {

        const response = await axios.post(
            `${API_URL}/diagram`,
            {
                documentId,
            }
        );

        return response.data;

    } catch (error: any) {

        throw new Error(
            error.response?.data?.error ||
            "Diagram generation failed."
        );

    }

}