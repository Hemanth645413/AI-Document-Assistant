import axios from "axios";

const API_URL = "http://localhost:5000/api";

export async function uploadDocument(
    file: File,
    userId: string
) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("user_id", userId);

    const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}