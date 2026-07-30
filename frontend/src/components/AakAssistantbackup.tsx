import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    MenuItem,
    Divider,
} from "@mui/material";

import API from "../services/api";
import { supabase } from "../services/supabase";

interface DocumentItem {
    id: string;
    file_name: string;
}

interface DocumentPreview {
    id: string;
    file_name: string;
    document_text: string;
}

interface ChatMessage {
    question: string;
    answer: string;
}

export default function AakAssistant() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [selectedDoc, setSelectedDoc] = useState("")

    const [selectedModel, setSelectedModel] =
        useState("gemini-flash");

    const [preview, setPreview] =
        useState<DocumentPreview | null>(null);

    const [question, setQuestion] = useState("");

    const [summary, setSummary] = useState("");

    const [, setDiagram] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    const [loading, setLoading] = useState(false);

    const [previewLoading, setPreviewLoading] =
        useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadDocuments();
    }, []);

    useEffect(() => {
        if (selectedDoc) {
            loadPreview(selectedDoc);
        } else {
            setPreview(null);
        }
    }, [selectedDoc]);

    async function loadDocuments() {

        const { data, error } = await supabase
            .from("documents")
            .select("id,file_name")
            .order("uploaded_at", { ascending: false });

        console.log("Documents:", data);
        console.log("Error:", error);

        if (!error && data) {
            setDocuments(data as DocumentItem[]);
        }
    }

    async function loadPreview(id: string) {
        try {
            setPreviewLoading(true);

            const res = await API.get(`/documents/${id}`);

            setPreview(res.data.document);
        } catch (err) {
            console.error(err);
        } finally {
            setPreviewLoading(false);
        }
    }

    async function askAI() {
        if (!selectedDoc || !question.trim()) {
            alert("Please select a document and enter a question.");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/chat", {
                documentId: selectedDoc,
                message: question,
                model: selectedModel,
            });

            console.log("AI Response:", res.data);

            const answer =
                res.data.answer ||
                res.data.response ||
                "No response received.";

            setChatHistory((prev) => [
                ...prev,
                {
                    question,
                    answer,
                },
            ]);

            setQuestion("");
        } catch (error: any) {
            console.error("FULL ERROR:", error);

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);

                alert(JSON.stringify(error.response.data, null, 2));
            } else {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    async function summarize() {
        if (!selectedDoc) {
            alert("Please select a document.");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/chat/summary", {
                documentId: selectedDoc,
                model: selectedModel,
            });

            console.log("Summary API Response:", res.data);

            navigate("/summary", {
                state: {
                    summary:
                        res.data.summary ||
                        res.data.response ||
                        "No summary generated.",
                },
            });
        } catch (error: any) {
            console.error(error);

            alert(
                error?.response?.data?.error ||
                "Failed to generate summary."
            );
        } finally {
            setLoading(false);
        }
    }


    async function generateDiagram() {
        if (!selectedDoc) {
            alert("Please select a document.");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/chat/diagram", {
                documentId: selectedDoc,
            });

            setDiagram(res.data.diagram || "");

            navigate("/diagram", {
                state: {
                    diagram: res.data.diagram || "",
                },
            });
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.error || "Failed to generate diagram.");
        } finally {
            setLoading(false);
        }
    }

    function clearChat() {
        setChatHistory([]);
        setSummary("");
        setQuestion("");
    }
    return (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                AI Document Assistant
            </Typography>

            <Typography color="text.secondary" mb={3}>
                Select a document, choose an AI model, ask questions or generate a
                summary.
            </Typography>

            <Box display="flex" gap={2} mb={3}>
                <TextField
                    select
                    fullWidth
                    label="Document"
                    value={selectedDoc}
                    onChange={(e) => setSelectedDoc(e.target.value)}
                >
                    {documents.map((doc) => (
                        <MenuItem key={doc.id} value={doc.id}>
                            {doc.file_name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    sx={{ minWidth: 220 }}
                    label="AI Model"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    <MenuItem value="gemini-flash">
                        Gemini Flash
                    </MenuItem>

                    <MenuItem value="groq-llama">
                        Groq Llama 3.3
                    </MenuItem>
                </TextField>
            </Box>

            {previewLoading && (
                <Box textAlign="center" mb={3}>
                    <CircularProgress />
                </Box>
            )}

            {preview && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 3,
                        maxHeight: 250,
                        overflow: "auto",
                    }}
                >
                    <Typography variant="h6">
                        {preview.file_name}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                        variant="body2"
                        sx={{
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {preview.document_text}
                    </Typography>
                </Paper>
            )}

            <TextField
                label="Ask a question"
                fullWidth
                multiline
                minRows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <Box display="flex" gap={2} mt={3}>
                <Button
                    variant="contained"
                    onClick={askAI}
                    disabled={loading}
                >
                    Ask AI
                </Button>

                <Button
                    variant="outlined"
                    onClick={summarize}
                    disabled={loading}
                >
                    Generate Summary
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={generateDiagram}
                    disabled={loading}
                >
                    Generate Diagram
                </Button>

                <Button
                    color="error"
                    variant="outlined"
                    onClick={clearChat}
                >
                    Clear Chat
                </Button>
            </Box>

            {

                loading && (
                    <Box textAlign="center" mt={3}>
                        <CircularProgress />
                    </Box>
                )
            }

            {
                chatHistory.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>
                            Conversation
                        </Typography>

                        {chatHistory.map((chat, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                }}
                            >
                                <Typography
                                    fontWeight="bold"
                                    color="primary"
                                >
                                    👤 You
                                </Typography>

                                <Typography mb={2}>
                                    {chat.question}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography
                                    fontWeight="bold"
                                    color="success.main"
                                >
                                    🤖 AI
                                </Typography>

                                <Typography
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {chat.answer}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )
            }
        </Paper >
    );
}