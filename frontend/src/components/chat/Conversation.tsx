import {
    Box,
    Paper,
    Typography,
    Divider,
} from "@mui/material";

interface ChatMessage {
    question: string;
    answer: string;
}

interface Props {
    chatHistory: ChatMessage[];
}

export default function Conversation({
    chatHistory,
}: Props) {
    return (
        <Box>
            {chatHistory.map((chat, index) => (
                <Paper
                    key={index}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        color="primary"
                        fontWeight="bold"
                    >
                        👤 You
                    </Typography>

                    <Typography mb={2}>
                        {chat.question}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                        color="success.main"
                        fontWeight="bold"
                    >
                        🤖 AI
                    </Typography>

                    <Typography
                        sx={{
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {chat.answer}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
}