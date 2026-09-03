import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
} from "@mui/material";

import {
    Description,
    Summarize,
    AccountTree,
    Translate,
    Image,
    QuestionAnswer,
    ImageSearch,
    Logout,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Dashboard() {
    const navigate = useNavigate();

    // ======================================
    // LOGOUT
    // ======================================

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    // ======================================
    // AI FEATURES
    // ======================================

    const features = [
        {
            title: "AI Document Assistant",
            description:
                "Upload documents and chat with AI",
            route: "/assistant",
            icon: (
                <Description
                    sx={{ fontSize: 40 }}
                />
            ),
        },

        {
            title: "AI Summary",
            description:
                "Generate document summaries",
            route: "/summary",
            icon: (
                <Summarize
                    sx={{ fontSize: 40 }}
                />
            ),
        },

        {
            title: "Diagram Generator",
            description:
                "Generate AI diagrams",
            route: "/diagram",
            icon: (
                <AccountTree
                    sx={{ fontSize: 40 }}
                />
            ),
        },

        {
            title: "Translation",
            description:
                "Translate text into multiple languages",
            route: "/translate",
            icon: (
                <Translate
                    sx={{ fontSize: 40 }}
                />
            ),
        },

        {
            title: "OCR",
            description:
                "Extract text from images",
            route: "/ocr",
            icon: (
                <ImageSearch
                    sx={{ fontSize: 40 }}
                />
            ),
        },

        {
            title: "Question & Answer",
            description:
                "Ask questions from uploaded documents",
            route: "/question-answer",
            icon: (
                <QuestionAnswer
                    sx={{ fontSize: 40 }}
                />
            ),
        },

        {
            title: "Image Generation",
            description:
                "Generate AI images from prompts",
            route: "/image-generation",
            icon: (
                <Image
                    sx={{ fontSize: 40 }}
                />
            ),
        },
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",

                backgroundColor: "#000000",

                color: "#FFFFFF",

                p: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },

                boxSizing: "border-box",

                overflowY: "auto",

                "&::-webkit-scrollbar": {
                    width: 8,
                },

                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#000000",
                },

                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#27272A",
                    borderRadius: 10,
                },

                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#3F3F46",
                },
            }}
        >
            {/* ======================================
                HEADER
            ====================================== */}

            <Box
                sx={{
                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: "center",

                    mb: 5,

                    backgroundColor: "#090909",

                    backgroundImage: "none",

                    color: "#FFFFFF",

                    p: {
                        xs: 2,
                        md: 3,
                    },

                    borderRadius: 4,

                    border:
                        "1px solid #27272A",

                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.35)",

                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },

                    gap: 3,
                }}
            >
                {/* ==================================
                    LEFT SIDE
                ================================== */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,

                        width: {
                            xs: "100%",
                            md: "auto",
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,

                            flexShrink: 0,

                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",

                            color: "#FFFFFF",

                            fontWeight: 700,

                            fontSize: 20,

                            boxShadow:
                                "0 0 25px rgba(99,102,241,0.25)",
                        }}
                    >
                        AI
                    </Avatar>

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#FFFFFF",

                                fontWeight: 700,

                                letterSpacing:
                                    "-0.5px",

                                fontSize: {
                                    xs: 25,
                                    sm: 30,
                                    md: 34,
                                },
                            }}
                        >
                            AI Document Assistant
                        </Typography>

                        <Typography
                            sx={{
                                color: "#A1A1AA",

                                mt: 0.5,

                                fontSize: {
                                    xs: 13,
                                    sm: 14,
                                },
                            }}
                        >
                            Welcome! Choose an AI
                            feature below.
                        </Typography>
                    </Box>
                </Box>

                {/* ==================================
                    RIGHT SIDE
                ================================== */}

                <Box
                    sx={{
                        display: "flex",

                        gap: 2,

                        alignItems: "center",

                        flexWrap: "wrap",

                        justifyContent: {
                            xs: "center",
                            md: "flex-end",
                        },

                        width: {
                            xs: "100%",
                            md: "auto",
                        },
                    }}
                >
                    <Chip
                        label={`${features.length} AI Features`}
                        sx={{
                            backgroundColor:
                                "#18181B",

                            color: "#F4F4F5",

                            border:
                                "1px solid #3F3F46",

                            fontWeight: 600,

                            "& .MuiChip-label": {
                                px: 2,
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        startIcon={
                            <Logout />
                        }
                        onClick={
                            handleLogout
                        }
                        sx={{
                            backgroundColor:
                                "#EF4444",

                            color: "#FFFFFF",

                            fontWeight: 600,

                            borderRadius: 2,

                            px: 2.5,

                            "&:hover": {
                                backgroundColor:
                                    "#DC2626",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* ======================================
                FEATURE CARDS
            ====================================== */}

            <Box
                sx={{
                    display: "grid",

                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",

                    gap: 3,
                }}
            >
                {features.map(
                    (feature) => (
                        <Card
                            key={
                                feature.title
                            }
                            onClick={() =>
                                navigate(
                                    feature.route
                                )
                            }
                            elevation={0}
                            sx={{
                                cursor:
                                    "pointer",

                                minHeight: 220,

                                backgroundColor:
                                    "#090909",

                                backgroundImage:
                                    "none",

                                color: "#FFFFFF",

                                borderRadius: 4,

                                border:
                                    "1px solid #27272A",

                                transition:
                                    "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",

                                "&:hover": {
                                    transform:
                                        "translateY(-8px)",

                                    borderColor:
                                        "#6366F1",

                                    boxShadow:
                                        "0 15px 40px rgba(99,102,241,0.18)",
                                },
                            }}
                        >
                            <CardContent
                                sx={{
                                    textAlign:
                                        "center",

                                    py: 5,

                                    px: 3,
                                }}
                            >
                                {/* ==================================
                                    ICON
                                ================================== */}

                                <Box
                                    sx={{
                                        color:
                                            "#8B5CF6",

                                        mb: 2,

                                        display:
                                            "flex",

                                        justifyContent:
                                            "center",

                                        alignItems:
                                            "center",

                                        width: 72,

                                        height: 72,

                                        mx: "auto",

                                        borderRadius:
                                            "20px",

                                        backgroundColor:
                                            "#18181B",

                                        border:
                                            "1px solid #27272A",

                                        transition:
                                            "0.3s",

                                        ".MuiCard-root:hover &":
                                        {
                                            backgroundColor:
                                                "#1E1B4B",
                                        },
                                    }}
                                >
                                    {
                                        feature.icon
                                    }
                                </Box>

                                {/* ==================================
                                    TITLE
                                ================================== */}

                                <Typography
                                    variant="h6"
                                    sx={{
                                        color:
                                            "#FFFFFF",

                                        fontWeight:
                                            700,

                                        mb: 1,
                                    }}
                                >
                                    {
                                        feature.title
                                    }
                                </Typography>

                                {/* ==================================
                                    DESCRIPTION
                                ================================== */}

                                <Typography
                                    sx={{
                                        color:
                                            "#A1A1AA",

                                        lineHeight:
                                            1.6,
                                    }}
                                >
                                    {
                                        feature.description
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    )
                )}
            </Box>
        </Box>
    );
}