import { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Box,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { supabase } from "../../services/supabase";

interface DocumentItem {
    id: string;
    file_name: string;
    file_type: string | null;
    uploaded_at: string;
}

export default function RecentDocuments() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        const { data, error } = await supabase
            .from("documents")
            .select("id, file_name, file_type, uploaded_at")
            .order("uploaded_at", { ascending: false })
            .limit(5);

        if (error) {
            console.error(error);
            return;
        }

        setDocuments(data || []);
    };

    const getFileType = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase();

        switch (extension) {
            case "pdf":
                return "PDF";
            case "doc":
            case "docx":
                return "Word";
            case "xls":
            case "xlsx":
                return "Excel";
            case "ppt":
            case "pptx":
                return "PPT";
            case "txt":
                return "Text";
            case "csv":
                return "CSV";
            default:
                return "File";
        }
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
                variant="h5"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Recent Documents
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
                {documents.length === 0 ? (
                    <Typography
                        color="text.secondary"
                        sx={{
                            textAlign: "center",
                            py: 4,
                        }}
                    >
                        No documents uploaded yet.
                    </Typography>
                ) : (
                    documents.map((doc) => (
                        <ListItem
                            key={doc.id}
                            disableGutters
                            sx={{
                                py: 1.5,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <DescriptionRoundedIcon color="primary" />
                            </ListItemIcon>

                            <ListItemText
                                primary={
                                    <Typography
                                        fontWeight={500}
                                        noWrap
                                    >
                                        {doc.file_name}
                                    </Typography>
                                }
                                secondary="Recently uploaded"
                                sx={{ mr: 2 }}
                            />

                            <Box sx={{ flexShrink: 0 }}>
                                <Chip
                                    label={getFileType(doc.file_name)}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );
}