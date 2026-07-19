import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
    return (
        <Box
            sx={{
                width: 260,
                height: "100vh",
                backgroundColor: "#ffffff",
                borderRight: "1px solid #e5e7eb",
                p: 2,
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 4,
                }}
            >
                AI Document Assistant
            </Typography>

            <List>
                <ListItemButton>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton>
                    <ListItemIcon>
                        <UploadFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Upload Documents" />
                </ListItemButton>

                <ListItemButton>
                    <ListItemIcon>
                        <ChatIcon />
                    </ListItemIcon>
                    <ListItemText primary="Chat with AI" />
                </ListItemButton>

                <ListItemButton>
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Summaries" />
                </ListItemButton>

                <ListItemButton>
                    <ListItemIcon>
                        <AccountTreeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Diagrams" />
                </ListItemButton>

                <ListItemButton>
                    <ListItemIcon>
                        <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="History" />
                </ListItemButton>

                <ListItemButton>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItemButton>

                <ListItemButton>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </List>
        </Box>
    );
};

export default Sidebar;