import { Paper, Typography, Divider } from "@mui/material";

interface Preview {
    file_name: string;
    document_text: string;
}

interface Props {
    preview: Preview | null;
}

export default function PreviewPanel({ preview }: Props) {
    if (!preview) return null;

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                mt: 3,
                borderRadius: 3,
                maxHeight: 250,
                overflow: "auto",
            }}
        >
            <Typography variant="h6">
                {preview.file_name}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap" }}
            >
                {preview.document_text}
            </Typography>
        </Paper>
    );
}