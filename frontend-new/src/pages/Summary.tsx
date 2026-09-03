import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Stack,
    CircularProgress,
    Alert,
    MenuItem,
} from "@mui/material";
import { supabase } from "../services/supabase";

interface Document {
    id: string;
    file_name: string;
}

export default function Summary() {
    // ============================
    // Document Selection
    // ============================
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState("");

    // ============================
    // Summary Generation
    // ============================
    const [summaryLength, setSummaryLength] = useState("medium");
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");
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
        setSummary("");
        setError("");
        setSuccess("");
    };

    // ============================
    // Generate summary
    // ============================
    const generateSummary = async () => {
        if (!selectedDocumentId) {
            setError("Please select a document.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            setSummary("");

            const response = await axios.post(
                "http://localhost:5000/api/chat/summary",
                {
                    documentId: selectedDocumentId,
                }
            );

            if (response.data.success) {
                setSummary(response.data.summary);
                setSuccess("Summary generated successfully!");
            } else {
                setError(
                    response.data.error || "Failed to generate summary"
                );
            }
        } catch (err: any) {
            console.error("Summary Error:", err);
            setError(
                err.response?.data?.error ||
                err.message ||
                "Summary generation failed."
            );
        } finally {
            setLoading(false);
        }
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
                    width: 750,
                    p: 4,
                    borderRadius: 4,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                    }}
                >
                    📝 AI Document Summary
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Generate a concise AI-powered summary of your uploaded
                    document.
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

                <Stack spacing={3}>
                    {/* Document Selection */}
                    <TextField
                        select
                        label="Select Document"
                        fullWidth
                        value={selectedDocumentId}
                        onChange={(e) =>
                            handleDocumentChange(e.target.value)
                        }
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

                    {/* Summary Length Selection */}
                    <TextField
                        select
                        label="Summary Length"
                        fullWidth
                        value={summaryLength}
                        onChange={(e) => setSummaryLength(e.target.value)}
                    >
                        <MenuItem value="short">Short (2-3 paragraphs)</MenuItem>
                        <MenuItem value="medium">Medium (5-7 paragraphs)</MenuItem>
                        <MenuItem value="long">Long (10+ paragraphs)</MenuItem>
                    </TextField>

                    {/* Generate Button */}
                    <Button
                        variant="contained"
                        size="large"
                        onClick={generateSummary}
                        disabled={!selectedDocumentId || loading}
                    >
                        {loading ? (
                            <>
                                <CircularProgress
                                    size={20}
                                    sx={{ mr: 1 }}
                                />
                                Generating...
                            </>
                        ) : (
                            "Generate Summary"
                        )}
                    </Button>

                    {/* Summary Output */}
                    <TextField
                        label="Summary Output"
                        multiline
                        rows={10}
                        fullWidth
                        value={summary}
                        InputProps={{
                            readOnly: true,
                        }}
                        placeholder="Your AI-generated summary will appear here..."
                    />
                </Stack>
            </Paper>
        </Box>
    );
}