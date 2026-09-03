import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Box,
    IconButton,
    Tooltip,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function ChatHeader() {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: "#000000",
                color: "#FFFFFF",
                borderBottom: "1px solid #27272A",
                backgroundImage: "none",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    height: 72,
                    px: 3,
                    bgcolor: "#000000",
                }}
            >
                {/* LEFT SIDE */}

                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: "#FFFFFF",
                            letterSpacing: 0.3,
                        }}
                    >
                        AI Document Assistant
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#A1A1AA",
                            mt: 0.5,
                        }}
                    >
                        Upload, analyze and chat with your documents
                    </Typography>
                </Box>

                {/* RIGHT SIDE */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Tooltip title="Notifications">
                        <IconButton
                            sx={{
                                color: "#A1A1AA",

                                "&:hover": {
                                    color: "#FFFFFF",
                                    bgcolor: "#18181B",
                                },
                            }}
                        >
                            <NotificationsNoneIcon />
                        </IconButton>
                    </Tooltip>

                    <Typography
                        sx={{
                            color: "#D4D4D8",
                            fontWeight: 500,
                        }}
                    >
                        Hemanth
                    </Typography>

                    <Avatar
                        sx={{
                            width: 44,
                            height: 44,
                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: 18,
                            boxShadow:
                                "0 4px 15px rgba(99, 102, 241, 0.25)",
                        }}
                    >
                        H
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
}