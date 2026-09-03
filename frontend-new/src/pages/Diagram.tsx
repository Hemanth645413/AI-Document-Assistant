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
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import { supabase } from "../services/supabase";

interface Document {
    id: string;
    file_name: string;
}

export default function Diagram() {
    // ============================
    // Document Selection
    // ============================
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState("");

    // ============================
    // Diagram Generation
    // ============================
    const [diagramType, setDiagramType] = useState("Flowchart");
    const [output, setOutput] = useState("");
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
        setOutput("");
        setError("");
        setSuccess("");
    };

    // ============================
    // Generate diagram
    // ============================
    const generateDiagram = async () => {
        if (!selectedDocumentId) {
            setError("Please select a document.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            setOutput("");

            const response = await axios.post(
                "http://localhost:5000/api/chat/diagram",
                {
                    documentId: selectedDocumentId,
                }
            );

            if (response.data.success) {
                setOutput(response.data.diagram);
                setSuccess(
                    `Diagram generated successfully using ${response.data.model}!`
                );
            } else {
                setError(
                    response.data.error || "Failed to generate diagram"
                );
            }
        } catch (err: any) {
            console.error("Diagram Error:", err);
            setError(
                err.response?.data?.error ||
                err.message ||
                "Diagram generation failed."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Download diagram
    // ============================
    const downloadDiagram = () => {
        if (!output) return;

        const element = document.createElement("a");
        const file = new Blob([output], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `diagram-${Date.now()}.mmd`;
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
                padding: 4,
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    width: 900,
                    padding: 5,
                    borderRadius: 4,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        textAlign: "center",
                        mb: 2,
                    }}
                >
                    🌳 AI Diagram Generator
                </Typography>

                <Typography
                    sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        mb: 4,
                    }}
                >
                    Generate Flowcharts, Mind Maps and Mermaid diagrams from
                    your uploaded documents.
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

                    {/* Diagram Type Selection */}
                    <TextField
                        select
                        fullWidth
                        label="Diagram Type"
                        value={diagramType}
                        onChange={(e) => setDiagramType(e.target.value)}
                    >
                        <MenuItem value="Flowchart">Flowchart</MenuItem>
                        <MenuItem value="Mind Map">Mind Map</MenuItem>
                        <MenuItem value="Mermaid">Mermaid Diagram</MenuItem>
                        <MenuItem value="Architecture">
                            Architecture Diagram
                        </MenuItem>
                    </TextField>

                    {/* Generate Button */}
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AccountTreeRoundedIcon />}
                        onClick={generateDiagram}
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
                            "Generate Diagram"
                        )}
                    </Button>

                    <Divider />

                    {/* Output Section */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Diagram Output
                    </Typography>

                    <Paper
                        variant="outlined"
                        sx={{
                            padding: 3,
                            minHeight: 250,
                            backgroundColor: "#FAFAFA",
                            whiteSpace: "pre-wrap",
                            fontFamily: "monospace",
                            fontSize: "0.875rem",
                            overflow: "auto",
                        }}
                    >
                        {output || "Diagram will appear here..."}
                    </Paper>

                    {/* Export Buttons */}
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={downloadDiagram}
                            disabled={!output}
                        >
                            Download Mermaid
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            disabled
                            title="Coming soon"
                        >
                            Export PNG
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            disabled
                            title="Coming soon"
                        >
                            Export PDF
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}