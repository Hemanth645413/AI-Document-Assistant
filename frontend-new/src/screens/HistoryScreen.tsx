import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    Chip,
    Button,
    IconButton,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const history = [
    {
        id: 1,
        title: "Resume Analysis",
        model: "Gemini",
        time: "Today • 10:30 AM",
    },
    {
        id: 2,
        title: "Project Documentation",
        model: "DeepSeek",
        time: "Yesterday • 7:15 PM",
    },
    {
        id: 3,
        title: "Financial Report Summary",
        model: "Groq",
        time: "2 Days Ago",
    },
    {
        id: 4,
        title: "Image OCR",
        model: "Gemini",
        time: "Last Week",
    },
];

export default function HistoryScreen() {
    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                bgcolor: "#000000",
                color: "#FFFFFF",
                p: 4,
                overflowY: "auto",

                "&::-webkit-scrollbar": {
                    width: 8,
                },

                "&::-webkit-scrollbar-track": {
                    background: "#000000",
                },

                "&::-webkit-scrollbar-thumb": {
                    background: "#27272A",
                    borderRadius: 10,
                },
            }}
        >
            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                }}
            >
                <HistoryRoundedIcon
                    sx={{
                        fontSize: 48,
                        color: "#8B5CF6",
                    }}
                />

                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#FFFFFF",
                            lineHeight: 1.2,
                        }}
                    >
                        Chat History
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#71717A",
                            mt: 0.5,
                        }}
                    >
                        Continue your previous conversations
                    </Typography>
                </Box>
            </Box>

            {/* ========================= */}
            {/* SEARCH */}
            {/* ========================= */}

            <Box
                sx={{
                    backgroundColor: "#090909",
                    border: "1px solid #27272A",
                    borderRadius: 4,
                    p: 2,
                    mb: 4,
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Search conversations..."
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon
                                    sx={{
                                        color: "#FFFFFF",
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#090909",
                            color: "#FFFFFF",
                            borderRadius: 3,

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

                        "& input": {
                            color: "#FFFFFF",
                        },

                        "& input::placeholder": {
                            color: "#71717A",
                            opacity: 1,
                        },
                    }}
                />
            </Box>

            {/* ========================= */}
            {/* HISTORY LIST */}
            {/* ========================= */}

            {history.map((item) => (
                <Card
                    key={item.id}
                    elevation={0}
                    sx={{
                        mb: 3,
                        backgroundColor: "#090909",
                        backgroundImage: "none",
                        color: "#FFFFFF",
                        border: "1px solid #27272A",
                        borderRadius: 4,

                        transition:
                            "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",

                        "&:hover": {
                            transform: "translateY(-3px)",
                            borderColor: "#6366F1",
                            boxShadow:
                                "0 15px 35px rgba(0,0,0,0.45)",
                        },
                    }}
                >
                    <CardContent
                        sx={{
                            p: 3,

                            "&:last-child": {
                                pb: 3,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 3,
                            }}
                        >
                            {/* LEFT SIDE */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    minWidth: 0,
                                }}
                            >
                                <HistoryRoundedIcon
                                    sx={{
                                        fontSize: 44,
                                        color: "#8B5CF6",
                                        flexShrink: 0,
                                    }}
                                />

                                <Box>
                                    <Typography
                                        sx={{
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            fontSize: 18,
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            gap: 1.5,
                                            mt: 1,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Chip
                                            size="small"
                                            label={item.model}
                                            sx={{
                                                backgroundColor:
                                                    "#18181B",
                                                color: "#E4E4E7",
                                                border:
                                                    "1px solid #27272A",
                                                fontWeight: 500,
                                            }}
                                        />

                                        <AccessTimeRoundedIcon
                                            sx={{
                                                fontSize: 18,
                                                color: "#71717A",
                                            }}
                                        />

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#A1A1AA",
                                            }}
                                        >
                                            {item.time}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* RIGHT SIDE */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={
                                        <ChatRoundedIcon />
                                    }
                                    endIcon={
                                        <ArrowForwardRoundedIcon />
                                    }
                                    sx={{
                                        mr: 1,
                                        px: 2.5,
                                        py: 1.2,
                                        borderRadius: 3,
                                        color: "#FFFFFF",
                                        fontWeight: 600,

                                        background:
                                            "linear-gradient(135deg, #6366F1, #8B5CF6)",

                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, #4F46E5, #7C3AED)",
                                        },
                                    }}
                                >
                                    Continue
                                </Button>

                                <IconButton
                                    sx={{
                                        color: "#A1A1AA",

                                        "&:hover": {
                                            color: "#EF4444",
                                            backgroundColor:
                                                "rgba(239,68,68,0.10)",
                                        },
                                    }}
                                >
                                    <DeleteRoundedIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}