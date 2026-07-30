import { Box, Typography } from "@mui/material";

export default function ChatHeader() {
    return (
        <Box textAlign="center" mb={4}>
            <Typography
                variant="h3"
                fontWeight="bold"
                color="primary"
            >
                🤖 AI Document Assistant
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                mt={1}
            >
                Ask anything about your documents
            </Typography>
        </Box>
    );
}