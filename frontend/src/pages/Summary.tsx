import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ClearIcon from "@mui/icons-material/Clear";
import ReactMarkdown from "react-markdown";

import Layout from "../components/Layout";
import API from "../services/api";
import { supabase } from "../services/supabase";

interface DocumentItem {
    id: string;
    file_name: string;
}

export default function Summary() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [selectedDoc, setSelectedDoc] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        const { data, error } = await supabase
            .from("documents")
            .select("id,file_name")
            .order("uploaded_at", { ascending: false });

        if (!error && data) {
            setDocuments(data);
        }
    }

    async function generateSummary() {
        if (!selectedDoc) {
            alert("Please select a document.");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/chat/summary", {
                documentId: selectedDoc,
            });

            setSummary(
                res.data.summary ||
                res.data.response ||
                "No summary generated."
            );
        } catch (err: any) {
            alert(
                err?.response?.data?.error ||
                "Failed to generate summary."
            );
        } finally {
            setLoading(false);
        }
    }

    async function copySummary() {
        if (!summary) return;

        await navigator.clipboard.writeText(summary);
        alert("Summary copied successfully.");
    }

    function clearSummary() {
        setSummary("");
        setSelectedDoc("");
    }

    return (
        <Layout>
            <Box
                sx={{
                    maxWidth: 1000,
                    mx: "auto",
                    mt: 4,
                    mb: 5,
                }}
            >
                <Card
                    elevation={6}
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ p: 4 }}>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            gutterBottom
                        >
                            📄 AI Document Summary
                        </Typography>

                        <Typography
                            color="text.secondary"
                            mb={4}
                        >
                            Select a document to generate a professional AI-powered summary.
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            label="Select Document"
                            value={selectedDoc}
                            onChange={(e) =>
                                setSelectedDoc(e.target.value)
                            }
                            sx={{ mb: 3 }}
                        >
                            {documents.map((doc) => (
                                <MenuItem
                                    key={doc.id}
                                    value={doc.id}
                                >
                                    {doc.file_name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Stack
                            direction="row"
                            spacing={2}
                            mb={4}
                        >
                            <Button
                                variant="contained"
                                startIcon={<AutoAwesomeIcon />}
                                onClick={generateSummary}
                                disabled={loading}
                            >
                                Generate Summary
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<ContentCopyIcon />}
                                disabled={!summary}
                                onClick={copySummary}
                            >
                                Copy
                            </Button>

                            <Button
                                color="error"
                                variant="outlined"
                                startIcon={<ClearIcon />}
                                disabled={!summary}
                                onClick={clearSummary}
                            >
                                Clear
                            </Button>
                        </Stack>

                        {loading && (
                            <Box
                                textAlign="center"
                                py={5}
                            >
                                <CircularProgress size={45} />

                                <Typography
                                    mt={2}
                                    color="text.secondary"
                                >
                                    Generating summary...
                                </Typography>
                            </Box>
                        )}

                        {summary && (
                            <>
                                <Divider sx={{ mb: 4 }} />

                                <Card
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: "#fafafa",
                                        borderRadius: 3,
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                maxWidth: "850px",
                                                mx: "auto",
                                                lineHeight: 1.9,
                                                fontSize: "16px",

                                                "& h1": {
                                                    fontSize: "2rem",
                                                    fontWeight: 700,
                                                    color: "primary.main",
                                                    mt: 3,
                                                    mb: 2,
                                                },

                                                "& h2": {
                                                    fontSize: "1.7rem",
                                                    fontWeight: 700,
                                                    color: "primary.main",
                                                    mt: 3,
                                                    mb: 2,
                                                },

                                                "& h3": {
                                                    fontSize: "1.35rem",
                                                    fontWeight: 600,
                                                    mt: 2,
                                                    mb: 1,
                                                },

                                                "& h4": {
                                                    fontSize: "1.15rem",
                                                    fontWeight: 600,
                                                    mt: 2,
                                                    mb: 1,
                                                },

                                                "& p": {
                                                    marginBottom: "16px",
                                                },

                                                "& ul": {
                                                    paddingLeft: "28px",
                                                    marginBottom: "18px",
                                                },

                                                "& ol": {
                                                    paddingLeft: "28px",
                                                    marginBottom: "18px",
                                                },

                                                "& li": {
                                                    marginBottom: "8px",
                                                },

                                                "& strong": {
                                                    color: "primary.main",
                                                    fontWeight: 700,
                                                },

                                                "& blockquote": {
                                                    borderLeft: "4px solid #1976d2",
                                                    paddingLeft: "16px",
                                                    color: "#666",
                                                    fontStyle: "italic",
                                                    margin: "20px 0",
                                                },

                                                "& code": {
                                                    backgroundColor: "#eeeeee",
                                                    padding: "3px 6px",
                                                    borderRadius: "4px",
                                                    fontFamily: "monospace",
                                                },

                                                "& pre": {
                                                    backgroundColor: "#f5f5f5",
                                                    padding: "16px",
                                                    overflowX: "auto",
                                                    borderRadius: "8px",
                                                },
                                            }}
                                        >
                                            <ReactMarkdown>
                                                {summary}
                                            </ReactMarkdown>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}