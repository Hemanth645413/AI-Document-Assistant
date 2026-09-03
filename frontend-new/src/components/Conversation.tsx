import { useEffect, useRef } from "react";

import {
    Box,
    Paper,
    Typography,
    Avatar,
    Stack,
    IconButton,
    Tooltip,
} from "@mui/material";

import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

interface ChatMessage {
    message: string;
    response: string;
}

interface Props {
    history: ChatMessage[];
}

export default function Conversation({
    history,
}: Props) {
    const bottomRef =
        useRef<HTMLDivElement>(null);

    // ======================================
    // AUTO SCROLL
    // ======================================

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [history]);

    // ======================================
    // COPY RESPONSE
    // ======================================

    const copyResponse = async (
        text: string
    ) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Copied!");
        } catch (error) {
            console.error(
                "Copy failed:",
                error
            );
        }
    };

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",

                px: {
                    xs: 2,
                    md: 4,
                },

                py: 4,

                backgroundColor: "#000000",
                color: "#FFFFFF",

                // Dark scrollbar
                "&::-webkit-scrollbar": {
                    width: "8px",
                },

                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#000000",
                },

                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#27272A",
                    borderRadius: "10px",
                },

                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#3F3F46",
                },
            }}
        >
            <Stack spacing={4}>
                {history.map(
                    (chat, index) => (
                        <Box key={index}>
                            {/* ==================================
                                USER MESSAGE
                            ================================== */}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    alignItems:
                                        "flex-start",
                                    mb: 3,
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        background:
                                            "linear-gradient(135deg, #4F46E5, #6366F1)",

                                        color: "#FFFFFF",

                                        p: 2.5,

                                        borderRadius:
                                            "18px 18px 4px 18px",

                                        maxWidth: {
                                            xs: "85%",
                                            md: "70%",
                                        },

                                        border:
                                            "1px solid rgba(255,255,255,0.08)",

                                        boxShadow:
                                            "0 8px 25px rgba(79,70,229,0.20)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "#FFFFFF",
                                            lineHeight: 1.7,
                                            whiteSpace:
                                                "pre-wrap",
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {chat.message}
                                    </Typography>
                                </Paper>

                                <Avatar
                                    sx={{
                                        ml: 2,

                                        width: 40,
                                        height: 40,

                                        background:
                                            "linear-gradient(135deg, #10B981, #059669)",

                                        color: "#FFFFFF",
                                    }}
                                >
                                    <PersonRoundedIcon />
                                </Avatar>
                            </Box>

                            {/* ==================================
                                AI RESPONSE
                            ================================== */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "flex-start",
                                }}
                            >
                                <Avatar
                                    sx={{
                                        mr: 2,

                                        width: 40,
                                        height: 40,

                                        background:
                                            "linear-gradient(135deg, #6366F1, #8B5CF6)",

                                        color: "#FFFFFF",
                                    }}
                                >
                                    <SmartToyRoundedIcon />
                                </Avatar>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        backgroundColor:
                                            "#0A0A0A",

                                        color: "#FFFFFF",

                                        p: 3,

                                        borderRadius:
                                            "4px 18px 18px 18px",

                                        border:
                                            "1px solid #27272A",

                                        maxWidth: {
                                            xs: "85%",
                                            md: "75%",
                                        },

                                        boxShadow:
                                            "0 8px 30px rgba(0,0,0,0.35)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            whiteSpace:
                                                "pre-wrap",

                                            lineHeight: 1.8,

                                            color:
                                                "#F4F4F5",

                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {chat.response}
                                    </Typography>

                                    {/* ==================================
                                        ACTION BUTTONS
                                    ================================== */}

                                    <Box
                                        sx={{
                                            mt: 2,

                                            display:
                                                "flex",

                                            gap: 0.5,

                                            borderTop:
                                                "1px solid #18181B",

                                            pt: 1.5,
                                        }}
                                    >
                                        {/* COPY */}

                                        <Tooltip title="Copy">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    copyResponse(
                                                        chat.response
                                                    )
                                                }
                                                sx={{
                                                    color:
                                                        "#71717A",

                                                    "&:hover":
                                                    {
                                                        color:
                                                            "#FFFFFF",

                                                        backgroundColor:
                                                            "#18181B",
                                                    },
                                                }}
                                            >
                                                <ContentCopyRoundedIcon
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        </Tooltip>

                                        {/* LIKE */}

                                        <Tooltip title="Like">
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    color:
                                                        "#71717A",

                                                    "&:hover":
                                                    {
                                                        color:
                                                            "#22C55E",

                                                        backgroundColor:
                                                            "#18181B",
                                                    },
                                                }}
                                            >
                                                <ThumbUpAltOutlinedIcon
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        </Tooltip>

                                        {/* DISLIKE */}

                                        <Tooltip title="Dislike">
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    color:
                                                        "#71717A",

                                                    "&:hover":
                                                    {
                                                        color:
                                                            "#EF4444",

                                                        backgroundColor:
                                                            "#18181B",
                                                    },
                                                }}
                                            >
                                                <ThumbDownAltOutlinedIcon
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    )
                )}

                {/* ==================================
                    AUTO SCROLL TARGET
                ================================== */}

                <div ref={bottomRef} />
            </Stack>
        </Box>
    );
}