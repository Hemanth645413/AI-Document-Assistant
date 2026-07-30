import { Box, Typography, Button } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface Props {
    onUpload?: () => void;
}

export default function EmptyState({ onUpload }: Props) {
    return (
        <Box
            sx={{
                textAlign: "center",
                py: 10,
                px: 3,
                border: "2px dashed #D1D5DB",
                borderRadius: 4,
                bgcolor: "#FAFAFA",
            }}
        >
            <FolderOpenIcon
                sx={{
                    fontSize: 80,
                    color: "text.secondary",
                    mb: 2,
                }}
            />

            <Typography variant="h5" fontWeight={700}>
                No Documents Found
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1, mb: 4 }}
            >
                Upload your first document to start using the AI Document Assistant.
            </Typography>

            <Button
                variant="contained"
                size="large"
                startIcon={<UploadFileIcon />}
                onClick={onUpload}
            >
                Upload Document
            </Button>
        </Box>
    );
}