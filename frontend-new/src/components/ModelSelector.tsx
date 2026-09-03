import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

interface Props {
    model: string;
    onChange: (model: string) => void;
}

export default function ModelSelector({
    model,
    onChange,
}: Props) {
    return (
        <FormControl
            size="small"
            sx={{
                width: 220,
                bgcolor: "#FFFFFF",
            }}
        >
            <InputLabel id="model-select-label">
                AI Model
            </InputLabel>

            <Select
                labelId="model-select-label"
                id="model-select"
                value={model}
                label="AI Model"
                onChange={(e) => onChange(e.target.value)}
            >
                <MenuItem value="gemini-flash">
                    Gemini Flash
                </MenuItem>

                <MenuItem value="groq-llama">
                    Groq Llama 3.3 70B
                </MenuItem>

                <MenuItem value="huggingface">
                    Hugging Face Llama 3.1
                </MenuItem>
            </Select>
        </FormControl>
    );
}