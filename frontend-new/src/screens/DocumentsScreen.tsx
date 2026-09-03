import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Button,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

const documents = [
    {
        id: 1,
        name: "Resume.pdf",
        type: "PDF",
        size: "1.2 MB",
        color: "#EF4444",
        icon: <PictureAsPdfRoundedIcon />,
    },
    {
        id: 2,
        name: "Sales_Report.xlsx",
        type: "Excel",
        size: "850 KB",
        color: "#10B981",
        icon: <TableChartRoundedIcon />,
    },
    {
        id: 3,
        name: "Project.docx",
        type: "Word",
        size: "2.1 MB",
        color: "#2563EB",
        icon: <DescriptionRoundedIcon />,
    },
];

export default function DocumentsScreen() {
    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,

                backgroundColor: "#000000",
                color: "#FFFFFF",

                p: 4,

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
                    mb: 4,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#FFFFFF",
                        mb: 0.5,
                    }}
                >
                    📂 Documents
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#A1A1AA",
                    }}
                >
                    Manage and access your uploaded documents
                </Typography>
            </Box>

            {/* ======================================
                SEARCH
            ====================================== */}

            <Box
                sx={{
                    backgroundColor: "#090909",

                    border:
                        "1px solid #27272A",

                    borderRadius: 4,

                    p: 2,

                    mb: 4,

                    boxShadow:
                        "0 8px 25px rgba(0,0,0,0.35)",
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Search documents..."
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon
                                    sx={{
                                        color: "#A1A1AA",
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
                                borderColor:
                                    "#27272A",
                            },

                            "&:hover fieldset": {
                                borderColor:
                                    "#3F3F46",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor:
                                    "#6366F1",
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

            {/* ======================================
                DOCUMENT CARDS
            ====================================== */}

            <Grid
                container
                spacing={3}
            >
                {documents.map((doc) => (
                    <Grid
                        key={doc.id}
                        size={{
                            xs: 12,
                            md: 6,
                            lg: 4,
                        }}
                    >
                        <Card
                            elevation={0}
                            sx={{
                                height: "100%",

                                backgroundColor:
                                    "#090909",

                                backgroundImage:
                                    "none",

                                border:
                                    "1px solid #27272A",

                                borderRadius: 4,

                                color: "#FFFFFF",

                                transition:
                                    "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",

                                "&:hover": {
                                    transform:
                                        "translateY(-5px)",

                                    borderColor:
                                        "#6366F1",

                                    boxShadow:
                                        "0 15px 35px rgba(0,0,0,0.45)",
                                },
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 2.5,

                                    "&:last-child": {
                                        pb: 2.5,
                                    },
                                }}
                            >
                                {/* ==================================
                                    FILE INFORMATION
                                ================================== */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 2,
                                        mb: 2.5,
                                    }}
                                >
                                    {/* File Icon */}

                                    <Box
                                        sx={{
                                            width: 58,
                                            height: 58,

                                            flexShrink: 0,

                                            borderRadius: 3,

                                            bgcolor: doc.color,

                                            color: "#FFFFFF",

                                            display: "flex",

                                            justifyContent:
                                                "center",

                                            alignItems:
                                                "center",

                                            boxShadow:
                                                `0 8px 20px ${doc.color}40`,
                                        }}
                                    >
                                        {doc.icon}
                                    </Box>

                                    {/* File Name */}

                                    <Box
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "#FFFFFF",

                                                fontWeight: 700,

                                                fontSize: 17,

                                                overflow:
                                                    "hidden",

                                                textOverflow:
                                                    "ellipsis",

                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            {doc.name}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color:
                                                    "#A1A1AA",

                                                mt: 0.5,
                                            }}
                                        >
                                            {doc.size}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* ==================================
                                    FILE TYPE
                                ================================== */}

                                <Chip
                                    label={doc.type}
                                    size="small"
                                    sx={{
                                        mb: 3,

                                        color: "#D4D4D8",

                                        backgroundColor:
                                            "#18181B",

                                        border:
                                            "1px solid #27272A",

                                        fontWeight: 500,
                                    }}
                                />

                                {/* ==================================
                                    ACTIONS
                                ================================== */}

                                <Box
                                    sx={{
                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "center",
                                    }}
                                >
                                    {/* Open */}

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <VisibilityRoundedIcon />
                                        }
                                        sx={{
                                            background:
                                                "linear-gradient(135deg, #6366F1, #8B5CF6)",

                                            color: "#FFFFFF",

                                            borderRadius: 2.5,

                                            px: 2.5,

                                            fontWeight: 600,

                                            "&:hover": {
                                                background:
                                                    "linear-gradient(135deg, #4F46E5, #7C3AED)",
                                            },
                                        }}
                                    >
                                        Open
                                    </Button>

                                    {/* Download + Delete */}

                                    <Box>
                                        <IconButton
                                            sx={{
                                                color:
                                                    "#A1A1AA",

                                                "&:hover": {
                                                    color:
                                                        "#FFFFFF",

                                                    backgroundColor:
                                                        "#18181B",
                                                },
                                            }}
                                        >
                                            <DownloadRoundedIcon />
                                        </IconButton>

                                        <IconButton
                                            sx={{
                                                color:
                                                    "#A1A1AA",

                                                "&:hover": {
                                                    color:
                                                        "#EF4444",

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
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}