import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Stack,
    Tooltip,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import SlideshowIcon from "@mui/icons-material/Slideshow";

import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Props {
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt?: string;

    onPreview?: (id: string) => void;
    onAskAI?: (id: string) => void;
    onDownload?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function DocumentCard({
    id,
    name,
    size,
    type,
    uploadedAt,
    onPreview,
    onAskAI,
    onDownload,
    onDelete,
}: Props) {
    const getIcon = () => {
        switch (type.toLowerCase()) {
            case "pdf":
                return (
                    <PictureAsPdfIcon
                        color="error"
                        sx={{ fontSize: 42 }}
                    />
                );

            case "doc":
            case "docx":
                return (
                    <DescriptionIcon
                        color="primary"
                        sx={{ fontSize: 42 }}
                    />
                );

            case "xls":
            case "xlsx":
                return (
                    <TableChartIcon
                        color="success"
                        sx={{ fontSize: 42 }}
                    />
                );

            case "ppt":
            case "pptx":
                return (
                    <SlideshowIcon
                        color="warning"
                        sx={{ fontSize: 42 }}
                    />
                );

            default:
                return (
                    <DescriptionIcon
                        color="action"
                        sx={{ fontSize: 42 }}
                    />
                );
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                transition: "0.25s",
                height: "100%",

                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {getIcon()}

                    <Chip
                        label={type.toUpperCase()}
                        color="primary"
                        size="small"
                    />
                </Stack>

                <Typography
                    variant="h6"
                    mt={2}
                    fontWeight={700}
                    noWrap
                >
                    {name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={0.5}
                >
                    Size: {size}
                </Typography>

                {uploadedAt && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Uploaded: {uploadedAt}
                    </Typography>
                )}

                <Box
                    mt={3}
                    display="flex"
                    justifyContent="space-between"
                >
                    <Tooltip title="Preview">
                        <IconButton
                            color="primary"
                            onClick={() => onPreview?.(id)}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Ask AI">
                        <IconButton
                            color="secondary"
                            onClick={() => onAskAI?.(id)}
                        >
                            <SmartToyIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Download">
                        <IconButton
                            color="success"
                            onClick={() => onDownload?.(id)}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton
                            color="error"
                            onClick={() => onDelete?.(id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
}