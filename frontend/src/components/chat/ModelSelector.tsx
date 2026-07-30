import { TextField, MenuItem } from "@mui/material";

interface Props {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
}

export default function ModelSelector({
    selectedModel,
    setSelectedModel,
}: Props) {
    return (
        <TextField
            select
            label="AI Model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            sx={{ width: 220 }}
        >
            <MenuItem value="gemini-flash">Gemini Flash</MenuItem>
            <MenuItem value="groq-llama">Groq Llama 3.3</MenuItem>
        </TextField>
    );
}