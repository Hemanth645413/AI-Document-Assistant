import { useState } from "react";
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    Divider,
} from "@mui/material";
import API from "../services/api";

interface ChatMessage {
    question: string;
    answer: string;
}

function AIChat() {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [summary, setSummary] = useState("");

    // ==========================
    // Ask AI
    // ==========================
    const handleAsk = async () => {
        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }

        try {
            setLoading(true);

            const currentQuestion = question;

            const response = await API.post("/chat", {
                message: currentQuestion,
            });

            setChatHistory((prev) => [
                ...prev,
                {
                    question: currentQuestion,
                    answer: response.data.answer,
                },
            ]);

            setQuestion("");
        } catch (error: any) {
            console.error(error);

            setChatHistory((prev) => [
                ...prev,
                {
                    question: question,
                    answer:
                        error.response?.data?.error ||
                        "Something went wrong.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================
    // Enter to Send
    // ==========================
    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleAsk();
        }
    };

    // ==========================
    // Clear Chat
    // ==========================
    const handleClearChat = () => {
        if (!window.confirm("Clear the conversation?")) return;

        setChatHistory([]);
        setQuestion("");
        setSummary("");
    };

    // ==========================
    // Document Summary
    // ==========================
    const handleSummary = async () => {
        try {
            setLoading(true);

            const response = await API.post("/chat/summary");

            setSummary(response.data.summary);
        } catch (error: any) {
            console.error(error);

            setSummary(
                error.response?.data?.error ||
                "Unable to generate summary."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                mt: 4,
                borderRadius: 3,
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
                align="center"
            >
                🤖 AI Assistant
            </Typography>

            <TextField
                fullWidth
                multiline
                rows={3}
                label="Ask a question about your uploaded document"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleAsk}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <CircularProgress
                                size={20}
                                sx={{ mr: 1 }}
                            />
                            Thinking...
                        </>
                    ) : (
                        "Ask AI"
                    )}
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClearChat}
                >
                    Clear Chat
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSummary}
                    disabled={loading}
                >
                    📄 Summarize
                </Button>
            </Box>

            {summary && (
                <Paper
                    elevation={2}
                    sx={{
                        mt: 4,
                        p: 2,
                        bgcolor: "#f8f9fa",
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        📄 Document Summary
                    </Typography>

                    <Typography>
                        {summary}
                    </Typography>
                </Paper>
            )}

            {chatHistory.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Conversation
                    </Typography>

                    {chatHistory.map((chat, index) => (
                        <Paper
                            key={index}
                            elevation={2}
                            sx={{
                                p: 2,
                                mb: 2,
                                bgcolor: "#fafafa",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    color: "primary.main",
                                }}
                            >
                                👤 You
                            </Typography>

                            <Typography sx={{ mb: 2 }}>
                                {chat.question}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    color: "success.main",
                                }}
                            >
                                🤖 AI
                            </Typography>

                            <Typography>
                                {chat.answer}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </Paper>
    );
}

export default AIChat;