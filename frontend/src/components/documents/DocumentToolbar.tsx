import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import RefreshIcon from "@mui/icons-material/Refresh";

interface Props {
    search: string;
    setSearch: (value: string) => void;
    view: "grid" | "table";
    setView: (value: "grid" | "table") => void;
    onUpload?: () => void;
    onRefresh?: () => void;
}

export default function DocumentToolbar({
    search,
    setSearch,
    view,
    setView,
    onUpload,
    onRefresh,
}: Props) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 4,
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    📄 Documents
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Manage and organize all your uploaded documents
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <TextField
                    size="small"
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    sx={{
                        width: {
                            xs: "100%",
                            sm: 300,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(_, value) => {
                        if (value) setView(value);
                    }}
                    size="small"
                >
                    <ToggleButton value="grid">
                        <GridViewIcon />
                    </ToggleButton>

                    <ToggleButton value="table">
                        <TableRowsIcon />
                    </ToggleButton>
                </ToggleButtonGroup>

                <Tooltip title="Refresh">
                    <Button
                        variant="outlined"
                        onClick={onRefresh}
                    >
                        <RefreshIcon />
                    </Button>
                </Tooltip>

                <Button
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    onClick={onUpload}
                >
                    Upload
                </Button>
            </Box>
        </Box>
    );
}