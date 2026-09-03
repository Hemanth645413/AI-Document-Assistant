import { useRef } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface Props {
    onSelectFile: (file: File) => void;
}

export default function UploadButton({ onSelectFile }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        onSelectFile(file);
    };

    return (
        <>
            <input
                ref={inputRef}
                hidden
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                onChange={handleChange}
            />

            <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleClick}
            >
                Upload
            </Button>
        </>
    );
}