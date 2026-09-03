import { useState, useRef } from "react";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    CircularProgress,
    Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function OCR() {
    // ============================
    // Image Upload
    // ============================
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ============================
    // OCR Results
    // ============================
    const [extractedText, setExtractedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ============================
    // Handle image file selection
    // ============================
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image file size must be less than 5MB.");
            return;
        }

        setSelectedImage(file);
        setError("");
        setSuccess("");
        setExtractedText("");

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // ============================
    // Trigger file input
    // ============================
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // ============================
    // Extract text from image (OCR)
    // ============================
    const extractTextFromImage = async () => {
        if (!selectedImage) {
            setError("Please select an image first.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            setExtractedText("");

            // Convert image to Base64
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const base64Image = (
                        reader.result as string
                    ).split(",")[1];

                    const response = await axios.post(
                        "http://localhost:5000/api/chat/ocr",
                        {
                            imageBase64: base64Image,
                        }
                    );

                    if (response.data.success) {
                        setExtractedText(response.data.extractedText);
                        setSuccess(
                            `Text extracted successfully using ${response.data.model}!`
                        );
                    } else {
                        setError(
                            response.data.error ||
                            "Failed to extract text from image"
                        );
                    }
                } catch (err: any) {
                    console.error("OCR Error:", err);
                    setError(
                        err.response?.data?.error ||
                        err.message ||
                        "OCR extraction failed."
                    );
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(selectedImage);
        } catch (err: any) {
            console.error("OCR Error:", err);
            setError(err.message || "OCR extraction failed.");
            setLoading(false);
        }
    };

    // ============================
    // Download extracted text
    // ============================
    const downloadText = () => {
        if (!extractedText) return;

        const element = document.createElement("a");
        const file = new Blob([extractedText], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `ocr-result-${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // ============================
    // Clear selection
    // ============================
    const clearSelection = () => {
        setSelectedImage(null);
        setImagePreview("");
        setExtractedText("");
        setError("");
        setSuccess("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
                    width: 900,
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
                    📷 OCR Document Scanner
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Extract text from scanned documents and images using AI OCR.
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
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: "none" }}
                    />

                    {/* Upload Button */}
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<CloudUploadIcon />}
                        onClick={triggerFileInput}
                        disabled={loading}
                    >
                        Upload Image
                    </Button>

                    {/* Image Preview */}
                    {imagePreview && (
                        <Card
                            sx={{
                                borderRadius: 3,
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                component="img"
                                src={imagePreview}
                                alt="Preview"
                                sx={{
                                    width: "100%",
                                    maxHeight: 300,
                                    objectFit: "contain",
                                }}
                            />
                        </Card>
                    )}

                    {/* Image Info */}
                    {selectedImage && !imagePreview && (
                        <Alert severity="info">
                            Image selected: {selectedImage.name} (
                            {(selectedImage.size / 1024).toFixed(2)} KB)
                        </Alert>
                    )}

                    {/* Extract Button */}
                    {selectedImage && (
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={extractTextFromImage}
                            disabled={loading || !selectedImage}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress
                                        size={20}
                                        sx={{ mr: 1 }}
                                    />
                                    Extracting Text...
                                </>
                            ) : (
                                "Extract Text from Image"
                            )}
                        </Button>
                    )}

                    {/* Extracted Text Output */}
                    {extractedText && (
                        <>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700 }}
                            >
                                Extracted Text
                            </Typography>

                            <TextField
                                multiline
                                rows={10}
                                fullWidth
                                value={extractedText}
                                InputProps={{
                                    readOnly: true,
                                }}
                                placeholder="Extracted text will appear here..."
                            />

                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    onClick={downloadText}
                                >
                                    Download Text
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={clearSelection}
                                >
                                    Clear & Try Another
                                </Button>
                            </Stack>
                        </>
                    )}

                    {/* Placeholder when no image selected */}
                    {!imagePreview && !extractedText && (
                        <Card
                            sx={{
                                minHeight: 250,
                                borderRadius: 3,
                                border: "2px dashed #D1D5DB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CardContent sx={{ textAlign: "center" }}>
                                <CloudUploadIcon
                                    sx={{
                                        fontSize: 48,
                                        color: "#9CA3AF",
                                        mb: 1,
                                    }}
                                />
                                <Typography color="text.secondary">
                                    Upload an image to extract text...
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}