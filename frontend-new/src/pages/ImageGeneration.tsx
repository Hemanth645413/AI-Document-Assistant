import { useState } from "react";
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
} from "@mui/material";

export default function ImageGeneration() {
    const [prompt, setPrompt] = useState("");
    const [style, setStyle] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState("");
    const [error, setError] = useState("");

    const generateImage = async () => {
        if (!prompt.trim()) {
            setError("Please enter an image prompt.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setImage("");

            const res = await axios.post(
                "http://localhost:5000/api/image",
                {
                    prompt:
                        style.trim() === ""
                            ? prompt
                            : `${prompt}, ${style}`,
                }
            );

            setImage(res.data.image);
        } catch (err: any) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                "Image generation failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                bgcolor: "#000000",
                color: "#F4F4F5",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                p: { xs: 2, md: 4 },
                overflowY: "auto",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 1100,
                    bgcolor: "#000000",
                    color: "#F4F4F5",
                    border: "1px solid #27272A",
                    borderRadius: 4,
                    p: { xs: 2, md: 4 },
                    backgroundImage: "none",
                }}
            >
                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                        color: "#FFFFFF",
                        mb: 1,
                    }}
                >
                    🎨 AI Image Generation
                </Typography>

                <Typography
                    sx={{
                        color: "#A1A1AA",
                        mb: 4,
                    }}
                >
                    Generate beautiful AI images using your prompt.
                </Typography>

                <Stack spacing={3}>

                    {/* ========================= */}
                    {/* PROMPT */}
                    {/* ========================= */}

                    <TextField
                        label="Image Prompt"
                        multiline
                        rows={4}
                        fullWidth
                        value={prompt}
                        onChange={(e) =>
                            setPrompt(e.target.value)
                        }
                        placeholder="Example: A futuristic smart city at sunset"
                        InputLabelProps={{
                            sx: {
                                color: "#A1A1AA",

                                "&.Mui-focused": {
                                    color: "#8B5CF6",
                                },
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#F4F4F5",
                                bgcolor: "#050505",

                                "& fieldset": {
                                    borderColor: "#27272A",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#3F3F46",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#6366F1",
                                },
                            },

                            "& textarea::placeholder": {
                                color: "#71717A",
                                opacity: 1,
                            },
                        }}
                    />

                    {/* ========================= */}
                    {/* STYLE */}
                    {/* ========================= */}

                    <TextField
                        label="Image Style (Optional)"
                        fullWidth
                        value={style}
                        onChange={(e) =>
                            setStyle(e.target.value)
                        }
                        placeholder="Realistic, Anime, Pixar, Watercolor..."
                        InputLabelProps={{
                            sx: {
                                color: "#A1A1AA",

                                "&.Mui-focused": {
                                    color: "#8B5CF6",
                                },
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#F4F4F5",
                                bgcolor: "#050505",

                                "& fieldset": {
                                    borderColor: "#27272A",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#3F3F46",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#6366F1",
                                },
                            },

                            "& input::placeholder": {
                                color: "#71717A",
                                opacity: 1,
                            },
                        }}
                    />

                    {/* ========================= */}
                    {/* GENERATE BUTTON */}
                    {/* ========================= */}

                    <Button
                        variant="contained"
                        size="large"
                        disabled={loading}
                        onClick={generateImage}
                        sx={{
                            height: 55,
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#FFFFFF",
                            borderRadius: 2,
                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",

                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #4F46E5, #7C3AED)",
                            },

                            "&.Mui-disabled": {
                                color: "#A1A1AA",
                                background: "#27272A",
                            },
                        }}
                    >
                        {loading
                            ? "Generating Image..."
                            : "Generate Image"}
                    </Button>

                    {/* ========================= */}
                    {/* ERROR */}
                    {/* ========================= */}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                bgcolor: "#1C0B0B",
                                color: "#FCA5A5",
                                border: "1px solid #7F1D1D",

                                "& .MuiAlert-icon": {
                                    color: "#EF4444",
                                },
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* ========================= */}
                    {/* IMAGE RESULT */}
                    {/* ========================= */}

                    <Card
                        elevation={0}
                        sx={{
                            minHeight: 520,
                            borderRadius: 3,
                            border: "2px dashed #3F3F46",
                            bgcolor: "#000000",
                            backgroundImage: "none",
                            color: "#F4F4F5",
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: 516,
                                flexDirection: "column",
                                p: 3,
                            }}
                        >

                            {/* LOADING */}

                            {loading ? (
                                <>
                                    <CircularProgress
                                        size={60}
                                        sx={{
                                            color: "#8B5CF6",
                                        }}
                                    />

                                    <Typography
                                        mt={2}
                                        sx={{
                                            color: "#A1A1AA",
                                        }}
                                    >
                                        AI is creating your image...
                                    </Typography>
                                </>
                            ) : image ? (

                                /* GENERATED IMAGE */

                                <>
                                    <Box
                                        component="img"
                                        src={image}
                                        alt="Generated AI"
                                        sx={{
                                            width: "100%",
                                            maxHeight: 420,
                                            objectFit: "contain",
                                            borderRadius: 2,
                                            bgcolor: "#000000",
                                        }}
                                    />

                                    <Button
                                        sx={{
                                            mt: 3,
                                            color: "#FFFFFF",
                                            borderColor: "#6366F1",

                                            "&:hover": {
                                                borderColor: "#8B5CF6",
                                                bgcolor:
                                                    "rgba(99,102,241,0.10)",
                                            },
                                        }}
                                        variant="outlined"
                                        href={image}
                                        download="AI_Image.png"
                                    >
                                        Download Image
                                    </Button>
                                </>

                            ) : (

                                /* EMPTY STATE */

                                <Typography
                                    sx={{
                                        color: "#71717A",
                                        textAlign: "center",
                                    }}
                                >
                                    Your generated image will appear here.
                                </Typography>
                            )}

                        </CardContent>
                    </Card>

                </Stack>
            </Paper>
        </Box>
    );
}