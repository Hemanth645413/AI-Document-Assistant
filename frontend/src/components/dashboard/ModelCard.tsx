import { useState } from "react";
import {
    Paper,
    Typography,
    Box,
    Chip,
    Divider,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";

import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function ModelCard() {
    const [model, setModel] = useState("gemini-flash");

    const handleChange = (event: SelectChangeEvent) => {
        setModel(event.target.value);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                height: "100%",
            }}
        >
            <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
            >
                AI Model
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box
                display="flex"
                justifyContent="center"
                mb={3}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "#E3F2FD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <SmartToyRoundedIcon
                        sx={{
                            fontSize: 45,
                            color: "#1976d2",
                        }}
                    />
                </Box>
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select AI Model</InputLabel>

                <Select
                    value={model}
                    label="Select AI Model"
                    onChange={handleChange}
                >
                    <MenuItem value="gemini-flash">
                        Gemini Flash
                    </MenuItem>

                    <MenuItem value="groq-llama">
                        Groq Llama 3.3 70B
                    </MenuItem>
                </Select>
            </FormControl>

            <Typography
                align="center"
                variant="subtitle1"
                fontWeight={700}
            >
                {model === "gemini-flash"
                    ? "Gemini Flash"
                    : "Groq Llama 3.3 70B"}
            </Typography>

            <Typography
                align="center"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Active AI Model
            </Typography>

            <Stack
                direction="row"
                justifyContent="center"
                mb={3}
            >
                <Chip
                    color="success"
                    icon={<CheckCircleRoundedIcon />}
                    label="Online"
                />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
            >
                ✔ Fast Responses
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
            >
                ✔ Document Question Answering
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
            >
                ✔ AI Summarization
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
            >
                ✔ Diagram Generation
            </Typography>
        </Paper>
    );
}