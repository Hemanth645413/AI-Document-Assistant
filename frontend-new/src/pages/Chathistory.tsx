import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    Button,
} from "@mui/material";

import {
    History as HistoryIcon,
    Refresh,
    Person,
    SmartToy,
} from "@mui/icons-material";

import axios from "axios";

interface ChatHistoryItem {
    id: string;
    user_id?: string;
    document_id?: string;
    question: string;
    answer: string;
    model_used?: string;
    created_at?: string;
}

const ChatHistory = () => {
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // Fetch Chat History
    // ==========================================

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("📚 Loading chat history...");

            const response = await axios.get(
                "http://localhost:5000/api/chat/history"
            );

            console.log(
                "✅ Chat History Response:",
                response.data
            );

            if (response.data?.success) {
                setHistory(
                    Array.isArray(response.data.history)
                        ? response.data.history
                        : []
                );
            } else {
                setHistory([]);
                setError(
                    response.data?.error ||
                    "Unable to load chat history."
                );
            }
        } catch (err: any) {
            console.error(
                "❌ Chat History Error:",
                err
            );

            setError(
                err.response?.data?.error ||
                err.message ||
                "Failed to load chat history."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Load History on Page Open
    // ==========================================

    useEffect(() => {
        fetchHistory();
    }, []);

    // ==========================================
    // Format Date
    // ==========================================

    const formatDate = (date?: string) => {
        if (!date) {
            return "Date unavailable";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString();
    };

    // ==========================================
    // Loading
    // ==========================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading chat history...
                </Typography>
            </Box>
        );
    }

    // ==========================================
    // Page
    // ==========================================

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                maxWidth: "1100px",
                mx: "auto",
            }}
        >
            {/* ==================================
                        Header
            ================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 4,
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 55,
                            height: 55,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                "linear-gradient(135deg, #667eea, #764ba2)",
                        }}
                    >
                        <HistoryIcon
                            sx={{
                                color: "white",
                                fontSize: 32,
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Chat History
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                        >
                            View your previous questions and AI answers
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchHistory}
                    sx={{
                        textTransform: "none",
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {/* ==================================
                        Error
            ================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {/* ==================================
                        Empty History
            ================================== */}

            {!error && history.length === 0 && (
                <Card
                    elevation={2}
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    <CardContent
                        sx={{
                            py: 8,
                            textAlign: "center",
                        }}
                    >
                        <HistoryIcon
                            sx={{
                                fontSize: 60,
                                color: "text.secondary",
                                mb: 2,
                            }}
                        />

                        <Typography
                            variant="h5"
                            fontWeight={600}
                            mb={1}
                        >
                            No Chat History
                        </Typography>

                        <Typography color="text.secondary">
                            Your questions and AI responses will
                            appear here after you use the AI
                            Document Assistant.
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* ==================================
                        History Count
            ================================== */}

            {history.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Chip
                        label={`${history.length} conversation${history.length !== 1
                            ? "s"
                            : ""
                            }`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>
            )}

            {/* ==================================
                        History Cards
            ================================== */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                {history.map((item, index) => (
                    <Card
                        key={
                            item.id ||
                            `${item.created_at}-${index}`
                        }
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            {/* Header */}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: {
                                        xs: "flex-start",
                                        sm: "center",
                                    },
                                    gap: 2,
                                    mb: 2,
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                    },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Conversation #{history.length - index}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {item.model_used && (
                                        <Chip
                                            label={
                                                item.model_used
                                            }
                                            size="small"
                                            color="primary"
                                        />
                                    )}

                                    {item.created_at && (
                                        <Chip
                                            label={formatDate(
                                                item.created_at
                                            )}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/* Question */}

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Person
                                    color="primary"
                                    sx={{
                                        mt: 0.3,
                                    }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        mb={0.5}
                                    >
                                        You
                                    </Typography>

                                    <Typography
                                        sx={{
                                            whiteSpace:
                                                "pre-wrap",
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {item.question ||
                                            "No question available."}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Answer */}

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                }}
                            >
                                <SmartToy
                                    color="secondary"
                                    sx={{
                                        mt: 0.3,
                                    }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        mb={0.5}
                                    >
                                        AI Assistant
                                    </Typography>

                                    <Typography
                                        sx={{
                                            whiteSpace:
                                                "pre-wrap",
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {item.answer ||
                                            "No answer available."}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default ChatHistory;