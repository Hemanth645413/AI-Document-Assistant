import { useState } from "react";
import axios from "axios";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";

const API_URL = "http://localhost:5000/api/chat";

const VideoGeneration = () => {
    // ======================================================
    // STATES
    // ======================================================

    const [mode, setMode] = useState<
        "text-to-video" | "image-to-video"
    >("text-to-video");

    const [prompt, setPrompt] = useState("");

    const [aspectRatio, setAspectRatio] =
        useState("16:9");

    const [resolution, setResolution] =
        useState("480p");

    const [duration] = useState(3);

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [videoUrl, setVideoUrl] =
        useState("");

    const [error, setError] =
        useState("");

    // ======================================================
    // IMAGE SELECT
    // ======================================================

    const handleImageSelect = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setImageFile(file);
        setError("");

        console.log(
            "🖼️ Selected image:",
            file.name
        );
    };

    // ======================================================
    // GENERATE VIDEO
    // ======================================================

    const handleGenerateVideo = async () => {
        if (!prompt.trim()) {
            setError("Please enter a video prompt.");
            return;
        }

        if (
            mode === "image-to-video" &&
            !imageFile
        ) {
            setError(
                "Please upload an image first."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");
            setVideoUrl("");

            console.log(
                "🎬 Starting video generation..."
            );

            // ==================================================
            // 1. CREATE VIDEO JOB
            // ==================================================

            let response;

            if (mode === "text-to-video") {
                // ----------------------------------------------
                // TEXT → VIDEO
                // ----------------------------------------------

                response = await axios.post(
                    `${API_URL}/video`,
                    {
                        prompt: prompt.trim(),
                        aspectRatio,
                        resolution,
                        duration,
                    },
                    {
                        timeout: 30000,
                    }
                );
            } else {
                // ----------------------------------------------
                // IMAGE → VIDEO
                // ----------------------------------------------

                const formData = new FormData();

                formData.append(
                    "image",
                    imageFile as File
                );

                formData.append(
                    "prompt",
                    prompt.trim()
                );

                formData.append(
                    "resolution",
                    resolution
                );

                formData.append(
                    "duration",
                    String(duration)
                );

                response = await axios.post(
                    `${API_URL}/image-to-video`,
                    formData,
                    {
                        timeout: 30000,
                    }
                );
            }

            console.log(
                "✅ Video API Response:",
                response.data
            );

            const videoId =
                response.data?.videoId;

            if (!videoId) {
                throw new Error(
                    response.data?.error ||
                    "Video ID was not returned."
                );
            }

            console.log(
                "🎬 Video Job ID:",
                videoId
            );

            // ==================================================
            // 2. CHECK VIDEO STATUS
            // ==================================================

            for (
                let attempt = 1;
                attempt <= 60;
                attempt++
            ) {
                console.log(
                    `⏳ Checking video status ${attempt}/60...`
                );

                await new Promise((resolve) =>
                    setTimeout(resolve, 5000)
                );

                const statusResponse =
                    await axios.get(
                        `${API_URL}/video/status/${videoId}`,
                        {
                            timeout: 30000,
                        }
                    );

                const statusData =
                    statusResponse.data;

                console.log(
                    "🎬 Video Status:",
                    statusData?.status
                );

                // ==================================================
                // VIDEO COMPLETED
                // ==================================================

                if (
                    statusData?.status ===
                    "complete"
                ) {
                    if (
                        !statusData?.videoUrl
                    ) {
                        throw new Error(
                            "Video completed but no video URL was returned."
                        );
                    }

                    console.log(
                        "✅ Video Ready:",
                        statusData.videoUrl
                    );

                    setVideoUrl(
                        statusData.videoUrl
                    );

                    return;
                }

                // ==================================================
                // VIDEO FAILED
                // ==================================================

                if (
                    statusData?.status ===
                    "error" ||
                    statusData?.status ===
                    "canceled"
                ) {
                    throw new Error(
                        statusData?.error ||
                        "Magic Hour video generation failed."
                    );
                }
            }

            throw new Error(
                "Video generation is taking too long. Please try again."
            );
        } catch (err: any) {
            console.error(
                "❌ Video Generation Error:",
                err
            );

            let message =
                "Video generation failed.";

            if (
                err.response?.data?.error
            ) {
                const apiError =
                    err.response.data.error;

                message =
                    typeof apiError ===
                        "string"
                        ? apiError
                        : JSON.stringify(
                            apiError
                        );
            } else if (err.message) {
                message = err.message;
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // DOWNLOAD VIDEO
    // ======================================================

    const handleDownload = () => {
        if (!videoUrl) {
            return;
        }

        const link =
            document.createElement("a");

        link.href = videoUrl;
        link.download =
            "generated-video.mp4";
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                padding: {
                    xs: 2,
                    md: 4,
                },
            }}
        >
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginBottom: 3,
                }}
            >
                <VideoLibraryIcon
                    sx={{
                        fontSize: 42,
                    }}
                />

                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Video Generation
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Create AI-generated videos
                        using text or images.
                    </Typography>
                </Box>
            </Box>

            {/* ==================================================
                MAIN CARD
            ================================================== */}

            <Card
                sx={{
                    maxWidth: 900,
                    margin: "0 auto",
                    borderRadius: 3,
                    boxShadow: 3,
                }}
            >
                <CardContent
                    sx={{
                        padding: {
                            xs: 2,
                            md: 4,
                        },
                    }}
                >
                    {/* ==================================================
                        MODE
                    ================================================== */}

                    <FormControl
                        fullWidth
                        sx={{
                            marginBottom: 3,
                        }}
                    >
                        <InputLabel>
                            Video Generation Type
                        </InputLabel>

                        <Select
                            value={mode}
                            label="Video Generation Type"
                            onChange={(event) =>
                                setMode(
                                    event.target
                                        .value as
                                    | "text-to-video"
                                    | "image-to-video"
                                )
                            }
                            disabled={loading}
                        >
                            <MenuItem value="text-to-video">
                                🎬 Text → Video
                            </MenuItem>

                            <MenuItem value="image-to-video">
                                🖼️ Image → Video
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {/* ==================================================
                        IMAGE UPLOAD
                    ================================================== */}

                    {mode ===
                        "image-to-video" && (
                            <Box
                                sx={{
                                    marginBottom: 3,
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    marginBottom={1}
                                >
                                    Upload Image
                                </Typography>

                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={
                                        <ImageIcon />
                                    }
                                    disabled={loading}
                                >
                                    Choose Image

                                    <input
                                        hidden
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={
                                            handleImageSelect
                                        }
                                    />
                                </Button>

                                {imageFile && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            marginTop: 1,
                                        }}
                                    >
                                        Selected:{" "}
                                        {
                                            imageFile.name
                                        }
                                    </Typography>
                                )}
                            </Box>
                        )}

                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        marginBottom={2}
                    >
                        {mode ===
                            "text-to-video"
                            ? "Describe Your Video"
                            : "Describe the Motion"}
                    </Typography>

                    {/* ==================================================
                        PROMPT
                    ================================================== */}

                    <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        label={
                            mode ===
                                "text-to-video"
                                ? "Video Prompt"
                                : "Motion Prompt"
                        }
                        placeholder={
                            mode ===
                                "text-to-video"
                                ? "Example: A majestic lion walking through the African savanna at sunset, cinematic camera movement, realistic..."
                                : "Example: The lion slowly walks forward while the grass moves in the wind, cinematic camera movement..."
                        }
                        value={prompt}
                        onChange={(event) =>
                            setPrompt(
                                event.target.value
                            )
                        }
                        disabled={loading}
                    />

                    {/* ==================================================
                        SETTINGS
                    ================================================== */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },
                            gap: 2,
                            marginTop: 3,
                        }}
                    >
                        {/* ==================================================
                            ASPECT RATIO
                        ================================================== */}

                        {mode ===
                            "text-to-video" && (
                                <FormControl fullWidth>
                                    <InputLabel>
                                        Aspect Ratio
                                    </InputLabel>

                                    <Select
                                        value={
                                            aspectRatio
                                        }
                                        label="Aspect Ratio"
                                        onChange={(
                                            event
                                        ) =>
                                            setAspectRatio(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                    >
                                        <MenuItem value="16:9">
                                            16:9 —
                                            Landscape
                                        </MenuItem>

                                        <MenuItem value="9:16">
                                            9:16 —
                                            Portrait
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            )}

                        {/* ==================================================
                            RESOLUTION
                        ================================================== */}

                        <FormControl fullWidth>
                            <InputLabel>
                                Resolution
                            </InputLabel>

                            <Select
                                value={
                                    resolution
                                }
                                label="Resolution"
                                onChange={(
                                    event
                                ) =>
                                    setResolution(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                disabled={
                                    loading
                                }
                            >
                                <MenuItem value="480p">
                                    480p — Free Tier
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* ==================================================
                        GENERATE BUTTON
                    ================================================== */}

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={
                            loading ? (
                                <CircularProgress
                                    size={20}
                                    color="inherit"
                                />
                            ) : (
                                <VideoLibraryIcon />
                            )
                        }
                        onClick={
                            handleGenerateVideo
                        }
                        disabled={loading}
                        sx={{
                            marginTop: 3,
                            padding: 1.5,
                            fontSize: "1rem",
                            fontWeight: "bold",
                        }}
                    >
                        {loading
                            ? "Generating Video..."
                            : "Generate Video"}
                    </Button>

                    {/* ==================================================
                        FREE TIER INFORMATION
                    ================================================== */}

                    <Box
                        sx={{
                            marginTop: 2,
                            padding: 1.5,
                            borderRadius: 2,
                            backgroundColor:
                                "#f3f0ff",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                        >
                            Magic Hour Wan 2.2 •
                            480p Free Tier
                        </Typography>
                    </Box>

                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {loading && (
                        <Box
                            sx={{
                                textAlign: "center",
                                marginTop: 3,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Your video is being
                                generated. Please
                                wait...
                            </Typography>
                        </Box>
                    )}

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <Box
                            sx={{
                                marginTop: 3,
                                padding: 2,
                                borderRadius: 2,
                                backgroundColor:
                                    "#ffebee",
                            }}
                        >
                            <Typography
                                color="error"
                                variant="body2"
                            >
                                {error}
                            </Typography>
                        </Box>
                    )}

                    {/* ==================================================
                        VIDEO RESULT
                    ================================================== */}

                    {videoUrl && (
                        <Box
                            sx={{
                                marginTop: 4,
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                marginBottom={2}
                            >
                                Generated Video
                            </Typography>

                            <Box
                                sx={{
                                    width: "100%",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    backgroundColor:
                                        "#000",
                                }}
                            >
                                <video
                                    controls
                                    playsInline
                                    style={{
                                        width: "100%",
                                        display: "block",
                                        maxHeight:
                                            "600px",
                                    }}
                                    src={videoUrl}
                                >
                                    Your browser does
                                    not support video
                                    playback.
                                </video>
                            </Box>

                            {/* ==================================================
                                ACTION BUTTONS
                            ================================================== */}

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    marginTop: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={
                                        <PlayCircleOutlineIcon />
                                    }
                                    onClick={() => {
                                        const video =
                                            document.querySelector(
                                                "video"
                                            ) as
                                            | HTMLVideoElement
                                            | null;

                                        if (video) {
                                            video.play();
                                        }
                                    }}
                                >
                                    Play Video
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <DownloadIcon />
                                    }
                                    onClick={
                                        handleDownload
                                    }
                                >
                                    Download Video
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default VideoGeneration;