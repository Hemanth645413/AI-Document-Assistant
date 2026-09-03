import {
    Box,
    Typography,
    Paper,
    Avatar,
    Divider,
    Button,
    Stack,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import SlideshowRoundedIcon from "@mui/icons-material/SlideshowRounded";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

interface Props {
    file: File | null;
}

export default function PreviewPanel({
    file,
}: Props) {
    if (!file) {
        return null;
    }

    const extension =
        file.name.split(".").pop()?.toLowerCase() || "";

    const getIcon = () => {
        switch (extension) {
            case "pdf":
                return (
                    <PictureAsPdfRoundedIcon
                        sx={{
                            fontSize: 55,
                            color: "#EF4444",
                        }}
                    />
                );

            case "xls":
            case "xlsx":
                return (
                    <TableChartRoundedIcon
                        sx={{
                            fontSize: 55,
                            color: "#10B981",
                        }}
                    />
                );

            case "ppt":
            case "pptx":
                return (
                    <SlideshowRoundedIcon
                        sx={{
                            fontSize: 55,
                            color: "#F59E0B",
                        }}
                    />
                );

            case "png":
            case "jpg":
            case "jpeg":
                return (
                    <ImageRoundedIcon
                        sx={{
                            fontSize: 55,
                            color: "#8B5CF6",
                        }}
                    />
                );

            default:
                return (
                    <DescriptionRoundedIcon
                        sx={{
                            fontSize: 55,
                            color: "#60A5FA",
                        }}
                    />
                );
        }
    };

    return (
        <Box
            sx={{
                height: "100%",
                backgroundColor: "#000000",
                p: 3,
                overflowY: "auto",

                "&::-webkit-scrollbar": {
                    width: "7px",
                },

                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#000000",
                },

                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#27272A",
                    borderRadius: "10px",
                },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,

                    backgroundColor: "#0A0A0A",

                    border:
                        "1px solid #27272A",

                    overflow: "hidden",

                    color: "#FFFFFF",

                    boxShadow:
                        "0 10px 35px rgba(0,0,0,0.45)",
                }}
            >
                {/* ======================================
                    HEADER
                ====================================== */}

                <Box
                    sx={{
                        p: 3,
                        textAlign: "center",

                        backgroundColor: "#0A0A0A",

                        borderBottom:
                            "1px solid #27272A",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 90,
                            height: 90,

                            mx: "auto",
                            mb: 2,

                            backgroundColor:
                                "#111111",

                            border:
                                "1px solid #27272A",
                        }}
                    >
                        {getIcon()}
                    </Avatar>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            color: "#FFFFFF",
                        }}
                    >
                        Document Preview
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#71717A",
                            mt: 0.5,
                        }}
                    >
                        Ready for AI Analysis
                    </Typography>
                </Box>

                {/* ======================================
                    FILE INFORMATION
                ====================================== */}

                <Box
                    sx={{
                        p: 3,
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "#71717A",
                            mb: 0.5,
                        }}
                    >
                        File Name
                    </Typography>

                    <Typography
                        fontWeight={600}
                        sx={{
                            color: "#F4F4F5",
                            wordBreak: "break-word",
                            mb: 2.5,
                        }}
                    >
                        {file.name}
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "#71717A",
                            mb: 0.5,
                        }}
                    >
                        File Type
                    </Typography>

                    <Typography
                        sx={{
                            color: "#F4F4F5",
                            mb: 2.5,
                        }}
                    >
                        {extension.toUpperCase()}
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "#71717A",
                            mb: 0.5,
                        }}
                    >
                        File Size
                    </Typography>

                    <Typography
                        sx={{
                            color: "#F4F4F5",
                        }}
                    >
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        borderColor: "#27272A",
                    }}
                />

                {/* ======================================
                    ACTIONS
                ====================================== */}

                <Stack
                    spacing={2}
                    sx={{
                        p: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={
                            <VisibilityRoundedIcon />
                        }
                        sx={{
                            borderRadius: 3,
                            py: 1.2,

                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",

                            color: "#FFFFFF",

                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #4F46E5, #7C3AED)",
                            },
                        }}
                    >
                        Preview
                    </Button>

                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={
                            <DownloadRoundedIcon />
                        }
                        sx={{
                            borderRadius: 3,
                            py: 1.2,

                            color: "#D4D4D8",

                            borderColor: "#3F3F46",

                            "&:hover": {
                                borderColor: "#6366F1",
                                backgroundColor:
                                    "rgba(99,102,241,0.08)",
                            },
                        }}
                    >
                        Download
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}