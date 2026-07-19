import { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Button,
    Box,
    TextField,
    Chip,
    Snackbar,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "../services/supabase";

function FileList() {
    const [files, setFiles] = useState<any[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success" as "success" | "error",
        message: "",
    });

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        setFilteredFiles(
            files.filter((file) =>
                file.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, files]);

    const loadFiles = async () => {
        setLoading(true);

        const { data, error } = await supabase.storage
            .from("documents")
            .list("private");

        if (error) {
            setSnackbar({
                open: true,
                severity: "error",
                message: error.message,
            });

            setLoading(false);
            return;
        }

        setFiles(data || []);
        setLoading(false);
    };

    const deleteFile = async (fileName: string) => {
        const confirmed = window.confirm(
            `Delete "${fileName}" ?`
        );

        if (!confirmed) return;

        const { error } = await supabase.storage
            .from("documents")
            .remove([`private/${fileName}`]);

        if (error) {
            setSnackbar({
                open: true,
                severity: "error",
                message: error.message,
            });
            return;
        }

        setSnackbar({
            open: true,
            severity: "success",
            message: "File deleted successfully.",
        });

        loadFiles();
    };

    const downloadFile = async (fileName: string) => {
        const { data } = await supabase.storage
            .from("documents")
            .createSignedUrl(`private/${fileName}`, 60);

        if (data?.signedUrl) {
            window.open(data.signedUrl, "_blank");
        }
    };

    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    borderRadius: 3,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                >
                    Uploaded Documents
                </Typography>

                <TextField
                    fullWidth
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    InputProps={{
                        startAdornment: <SearchIcon />,
                    }}
                    sx={{ mb: 3 }}
                />

                <Divider />

                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        mt={4}
                    >
                        <CircularProgress />
                    </Box>
                ) : filteredFiles.length === 0 ? (
                    <Typography
                        mt={3}
                        align="center"
                    >
                        No documents found.
                    </Typography>
                ) : (
                    <List>
                        {filteredFiles.map((file) => (
                            <ListItem
                                key={file.name}
                                divider
                            >
                                <DescriptionIcon
                                    color="primary"
                                    sx={{ mr: 2 }}
                                />

                                <ListItemText
                                    primary={file.name}
                                    secondary={`Size: ${(
                                        (file.metadata?.size || 0) /
                                        1024
                                    ).toFixed(1)} KB`}
                                />

                                <Chip
                                    label={
                                        file.name
                                            .split(".")
                                            .pop()
                                            ?.toUpperCase()
                                    }
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 2 }}
                                />

                                <Button
                                    startIcon={
                                        <DownloadIcon />
                                    }
                                    onClick={() =>
                                        downloadFile(
                                            file.name
                                        )
                                    }
                                    sx={{ mr: 1 }}
                                >
                                    Download
                                </Button>

                                <Button
                                    color="error"
                                    variant="outlined"
                                    startIcon={
                                        <DeleteIcon />
                                    }
                                    onClick={() =>
                                        deleteFile(
                                            file.name
                                        )
                                    }
                                >
                                    Delete
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false,
                    })
                }
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default FileList;