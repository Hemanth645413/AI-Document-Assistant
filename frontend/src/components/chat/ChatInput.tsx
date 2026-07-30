import {
    Box,
    TextField,
    IconButton,
    Paper,
    MenuItem,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

interface Props {
    question: string;
    setQuestion: (value: string) => void;
    selectedModel: string;
    setSelectedModel: (value: string) => void;
    askAI: () => void;
}

export default function ChatInput({
    question,
    setQuestion,
    selectedModel,
    setSelectedModel,
    askAI,
}: Props) {
    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: 4,
                mb: 4,
            }}
        >
            <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Ask anything about your document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                variant="standard"
            />

            <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>

                    <IconButton>
                        <MicIcon />
                    </IconButton>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <TextField
                        select
                        size="small"
                        value={selectedModel}
                        onChange={(e) =>
                            setSelectedModel(e.target.value)
                        }
                    >
                        <MenuItem value="gemini-flash">
                            Gemini Flash
                        </MenuItem>

                        <MenuItem value="groq-llama">
                            Groq Llama
                        </MenuItem>
                    </TextField>

                    <IconButton
                        color="primary"
                        onClick={askAI}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
}