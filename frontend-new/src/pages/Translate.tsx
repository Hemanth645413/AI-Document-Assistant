import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    MenuItem,
    Stack,
    CircularProgress,
    Alert,
} from "@mui/material";
import { supabase } from "../services/supabase";

interface Document {
    id: string;
    file_name: string;
}

const LANGUAGES = [
    { code: "english", label: "English" },
    { code: "spanish", label: "Spanish" },
    { code: "french", label: "French" },
    { code: "german", label: "German" },
    { code: "italian", label: "Italian" },
    { code: "portuguese", label: "Portuguese" },
    { code: "russian", label: "Russian" },
    { code: "chinese", label: "Chinese (Simplified)" },
    { code: "japanese", label: "Japanese" },
    { code: "korean", label: "Korean" },
    { code: "hindi", label: "Hindi" },
    { code: "telugu", label: "Telugu" },
    { code: "tamil", label: "Tamil" },
    { code: "kannada", label: "Kannada" },
    { code: "arabic", label: "Arabic" },
];

export default function Translate() {
    // ============================
    // Document Selection
    // ============================
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState("");

    // ============================
    // Translation
    // ============================
    const [targetLanguage, setTargetLanguage] = useState("spanish");
    const [translatedText, setTranslatedText] = useState("");
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
        setTranslatedText("");
        setError("");
        setSuccess("");
    };

    // ============================
    // Translate document
    // ============================
    const translateDocument = async () => {
        if (!selectedDocumentId) {
            setError("Please select a document.");
            return;
        }

        if (!targetLanguage) {
            setError("Please select a target language.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            setTranslatedText("");

            const response = await axios.post(
                "http://localhost:5000/api/chat/translate",
                {
                    documentId: selectedDocumentId,
                    targetLanguage,
                }
            );

            if (response.data.success) {
                setTranslatedText(response.data.translatedText);
                setSuccess(
                    `Document translated to ${targetLanguage} successfully!`
                );
            } else {
                setError(
                    response.data.error || "Failed to translate document"
                );
            }
        } catch (err: any) {
            console.error("Translation Error:", err);
            setError(
                err.response?.data?.error ||
                err.message ||
                "Translation failed."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Download translated text
    // ============================
    const downloadTranslation = () => {
        if (!translatedText) return;

        const element = document.createElement("a");
        const file = new Blob([translatedText], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `translated-${targetLanguage}-${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F8FAFC",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 3,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: 800,
                    padding: 4,
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
                    🌐 Translate Document
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mb: 4,
                    }}
                >
                    Translate your uploaded documents into different
                    languages.
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

                    {/* Target Language Selection */}
                    <TextField
                        select
                        label="Target Language"
                        fullWidth
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                    >
                        {LANGUAGES.map((lang) => (
                            <MenuItem key={lang.code} value={lang.code}>
                                {lang.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Translate Button */}
                    <Button
                        variant="contained"
                        size="large"
                        onClick={translateDocument}
                        disabled={!selectedDocumentId || loading}
                    >
                        {loading ? (
                            <>
                                <CircularProgress
                                    size={20}
                                    sx={{ mr: 1 }}
                                />
                                Translating...
                            </>
                        ) : (
                            "Translate Document"
                        )}
                    </Button>

                    {/* Translated Output */}
                    {translatedText && (
                        <>
                            <TextField
                                label="Translated Text"
                                multiline
                                rows={12}
                                fullWidth
                                value={translatedText}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <Button
                                variant="outlined"
                                onClick={downloadTranslation}
                            >
                                Download Translation
                            </Button>
                        </>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}