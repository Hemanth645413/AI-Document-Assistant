import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    MenuItem,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { supabase } from "../services/supabase";

interface Document {
    id: string;
    file_name: string;
}

interface QAHistory {
    question: string;
    answer: string;
    timestamp: Date;
}

export default function QuestionAnswer() {
    // ============================
    // Document Selection
    // ============================
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState("");

    // ============================
    // Question & Answer
    // ============================
    const [question, setQuestion] = useState("");
    const [selectedModel, setSelectedModel] = useState("gemini");
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [qaHistory, setQaHistory] = useState<QAHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ============================
    // Fetch documents on mount
    // ============================
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const {
                    data: { user },
                    error: authError,
                } = await supabase.auth.getUser();

                if (authError || !user) {
                    setError("Please login first.");
                    return;
                }

                const { data, error } = await supabase
                    .from("documents")
                    .select("id, file_name")
                    .eq("user_id", user.id);

                if (error) {
                    setError(error.message);
                    return;
                }

                if (data) {
                    setDocuments(data);
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch documents");
            }
        };

        fetchDocuments();
    }, []);

    // ============================
    // Handle document selection
    // ============================
    const handleDocumentChange = (documentId: string) => {
        setSelectedDocumentId(documentId);
        setQuestion("");
        setCurrentAnswer("");
        setQaHistory([]);
        setError("");
        setSuccess("");
    };

    // ============================
    // Ask question
    // ============================
    const askQuestion = async () => {
        if (!selectedDocumentId) {
            setError("Please select a document.");
            return;
        }

        if (!question.trim()) {
            setError("Please enter a question.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            setCurrentAnswer("");

            const response = await axios.post(
                "http://localhost:5000/api/chat",
                {
                    documentId: selectedDocumentId,
                    message: question,
                    model: selectedModel,
                }
            );

            if (response.data.success) {
                setCurrentAnswer(response.data.answer);
                setQaHistory([
                    ...qaHistory,
                    {
                        question,
                        answer: response.data.answer,
                        timestamp: new Date(),
                    },
                ]);
                setQuestion("");
                setSuccess(
                    `Answer received from ${response.data.model}!`
                );
            } else {
                setError(response.data.error || "Failed to get answer");
            }
        } catch (err: any) {
            console.error("Question Error:", err);
            setError(
                err.response?.data?.error ||
                err.message ||
                "Failed to get answer."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Handle Enter key
    // ============================
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !loading) {
            e.preventDefault();
            askQuestion();
        }
    };

    // ============================
    // Clear history
    // ============================
    const clearHistory = () => {
        setQaHistory([]);
        setCurrentAnswer("");
        setQuestion("");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F8FAFC",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: 900,
                    p: 4,
                    borderRadius: 4,
                    maxHeight: "90vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                    }}
                >
                    💬 Ask Your Document
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Ask questions about your uploaded document and receive
                    AI-powered answers.
                </Typography>

                {/* Display messages */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Stack spacing={3} sx={{ flex: 1, overflowY: "auto" }}>
                    {/* Document & Model Selection */}
                    <Stack direction="row" spacing={2}>
                        <TextField
                            select
                            label="Select Document"
                            fullWidth
                            value={selectedDocumentId}
                            onChange={(e) =>
                                handleDocumentChange(e.target.value)
                            }
                            size="small"
                        >
                            {documents.length === 0 && (
                                <MenuItem value="">
                                    No documents available
                                </MenuItem>
                            )}
                            {documents.map((doc) => (
                                <MenuItem key={doc.id} value={doc.id}>
                                    {doc.file_name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="AI Model"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            size="small"
                            sx={{ width: 200 }}
                        >
                            <MenuItem value="gemini">Gemini</MenuItem>
                            <MenuItem value="groq">Groq/Llama</MenuItem>
                            <MenuItem value="huggingface">
                                HuggingFace
                            </MenuItem>
                        </TextField>
                    </Stack>

                    {/* Q&A History */}
                    {qaHistory.length > 0 && (
                        <Box sx={{ flex: 1, overflowY: "auto" }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700, mb: 2 }}
                            >
                                Conversation History
                            </Typography>

                            <Stack spacing={2}>
                                {qaHistory.map((qa, idx) => (
                                    <Stack
                                        key={idx}
                                        spacing={1}
                                    >
                                        {/* Question */}
                                        <Card
                                            sx={{
                                                backgroundColor: "#E3F2FD",
                                                p: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 700 }}
                                            >
                                                Q: {qa.question}
                                            </Typography>
                                        </Card>

                                        {/* Answer */}
                                        <Card
                                            sx={{
                                                backgroundColor: "#F3E5F5",
                                                p: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                            >
                                                <strong>A:</strong> {qa.answer}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ mt: 1, display: "block" }}
                                            >
                                                {qa.timestamp.toLocaleTimeString()}
                                            </Typography>
                                        </Card>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Current Answer Display */}
                    {currentAnswer && (
                        <Card
                            sx={{
                                minHeight: 150,
                                borderRadius: 2,
                                border: "1px solid #E5E7EB",
                                backgroundColor: "#FAFAFA",
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 700, mb: 1 }}
                                >
                                    Latest Answer
                                </Typography>
                                <Typography variant="body2">
                                    {currentAnswer}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    {/* Question Input */}
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Ask a Question"
                            placeholder="Example: What is the main topic? Summarize the key points."
                            multiline
                            maxRows={4}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={
                                !selectedDocumentId ||
                                loading
                            }
                        />

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<SendIcon />}
                                onClick={askQuestion}
                                disabled={
                                    !selectedDocumentId ||
                                    !question.trim() ||
                                    loading
                                }
                                fullWidth
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress
                                            size={20}
                                            sx={{ mr: 1 }}
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    "Ask AI"
                                )}
                            </Button>

                            {qaHistory.length > 0 && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={clearHistory}
                                    disabled={loading}
                                >
                                    Clear History
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}