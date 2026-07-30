import { Box, Paper, Typography, Divider } from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";

import FileUpload from "../FileUpload";
import AIChat from "../AIChat";

export default function UploadSection() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    lg: "1fr 1fr",
                },
                gap: 3,
                mb: 4,
            }}
        >
            {/* Upload Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid #E5E7EB",
                    transition: "0.3s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                    },
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <CloudUploadRoundedIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Upload Document
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Upload PDF, DOCX, PPT, Excel, or text files to analyze them with AI.
                </Typography>

                <FileUpload />
            </Paper>

            {/* AI Chat Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid #E5E7EB",
                    transition: "0.3s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                    },
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <SmartToyRoundedIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        AI Assistant
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Ask questions about your uploaded documents using Gemini, Groq, or LiteLLM.
                </Typography>

                <AIChat />
            </Paper>
        </Box>
    );
}