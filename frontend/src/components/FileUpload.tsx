import { useState } from "react";
import {
    Paper,
    Typography,
    Box,
    Button,
    LinearProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import API from "../services/api";

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success" as "success" | "error",
        message: "",
    });

    const allowedExtensions = [
        "pdf",
        "doc",
        "docx",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
    ];

    const validateFile = (file: File) => {
        const extension = file.name.split(".").pop()?.toLowerCase();

        if (!extension || !allowedExtensions.includes(extension)) {
            setSnackbar({
                open: true,
                severity: "error",
                message: "Unsupported file type.",
            });
            return false;
        }

        if (file.size > 20 * 1024 * 1024) {
            setSnackbar({
                open: true,
                severity: "error",
                message: "Maximum file size is 20 MB.",
            });
            return false;
        }

        return true;
    };

    const handleFile = (file: File) => {
        if (validateFile(file)) {
            setSelectedFile(file);
        }
    };

    const handleBrowse = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files?.length) {
            handleFile(event.target.files[0]);
        }
    };

    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();

        if (event.dataTransfer.files.length) {
            handleFile(event.dataTransfer.files[0]);
        }
    };

    const uploadFile = async () => {
        if (!selectedFile) return;

        try {
            setUploading(true);
            setProgress(10);

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await API.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) /
                            progressEvent.total
                        );
                        setProgress(percent);
                    }
                },
            });

            console.log(response.data);

            setProgress(100);

            setSnackbar({
                open: true,
                severity: "success",
                message: "File uploaded successfully!",
            });

            // Clear selected file after upload
            setSelectedFile(null);

        } catch (error: any) {
            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    error.response?.data?.error ||
                    "Upload failed.",
            });
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    borderRadius: 3,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                >
                    Upload Document
                </Typography>

                <Box
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    sx={{
                        border: "2px dashed",
                        borderColor: "primary.main",
                        borderRadius: 3,
                        p: 3,
                        minHeight: 260,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        bgcolor: "#fafafa",
                    }}
                >
                    <CloudUploadIcon
                        color="primary"
                        sx={{ fontSize: 55, mb: 2 }}
                    />

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Drag & Drop your files here
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mb={2}
                    >
                        PDF, DOCX, PPTX, XLSX (Max 20 MB)
                    </Typography>

                    <Button
                        component="label"
                        variant="contained"
                    >
                        Browse Files

                        <input
                            hidden
                            type="file"
                            onChange={handleBrowse}
                        />
                    </Button>

                    {selectedFile && (
                        <Box mt={3}>
                            <InsertDriveFileIcon color="primary" />

                            <Typography fontWeight="bold">
                                {selectedFile.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>

                            <Button
                                sx={{ mt: 2 }}
                                variant="contained"
                                onClick={uploadFile}
                                disabled={uploading}
                            >
                                Upload
                            </Button>
                        </Box>
                    )}

                    {uploading && (
                        <Box width="100%" mt={3}>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                            />
                        </Box>
                    )}
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false,
                    })
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default FileUpload;