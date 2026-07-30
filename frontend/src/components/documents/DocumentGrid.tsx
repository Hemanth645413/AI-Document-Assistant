import { Grid } from "@mui/material";
import DocumentCard from "./DocumentCard";

export interface Document {
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt?: string;
}

interface Props {
    documents: Document[];

    onPreview?: (id: string) => void;
    onAskAI?: (id: string) => void;
    onDownload?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function DocumentGrid({
    documents,
    onPreview,
    onAskAI,
    onDownload,
    onDelete,
}: Props) {
    return (
        <Grid container spacing={3}>
            {documents.map((doc) => (
                <Grid
                    key={doc.id}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                >
                    <DocumentCard
                        id={doc.id}
                        name={doc.name}
                        size={doc.size}
                        type={doc.type}
                        uploadedAt={doc.uploadedAt}
                        onPreview={onPreview}
                        onAskAI={onAskAI}
                        onDownload={onDownload}
                        onDelete={onDelete}
                    />
                </Grid>
            ))}
        </Grid>
    );
}