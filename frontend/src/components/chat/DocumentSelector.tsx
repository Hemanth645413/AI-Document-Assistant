import { TextField, MenuItem } from "@mui/material";

interface DocumentItem {
    id: string;
    file_name: string;
}

interface Props {
    documents: DocumentItem[];
    selectedDoc: string;
    setSelectedDoc: (id: string) => void;
}

export default function DocumentSelector({
    documents,
    selectedDoc,
    setSelectedDoc,
}: Props) {
    return (
        <TextField
            select
            fullWidth
            label="Select Document"
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
        >
            {documents.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                    {doc.file_name}
                </MenuItem>
            ))}
        </TextField>
    );
}