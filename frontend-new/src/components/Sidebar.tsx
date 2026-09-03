import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Box,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 260;

interface SidebarProps {
    selectedMenu: string;
    onMenuChange: (menu: string) => void;
}

const menuItems = [
    {
        id: "chat",
        text: "New Chat",
        icon: <ChatIcon />,
    },
    {
        id: "documents",
        text: "Documents",
        icon: <DescriptionIcon />,
    },
    {
        id: "history",
        text: "History",
        icon: <HistoryIcon />,
    },
    {
        id: "settings",
        text: "Settings",
        icon: <SettingsIcon />,
    },
];

export default function Sidebar({
    selectedMenu,
    onMenuChange,
}: SidebarProps) {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,

                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",

                    backgroundColor: "#0B0B0B",
                    backgroundImage: "none",

                    color: "#F8FAFC",

                    borderRight: "1px solid #202020",

                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* ========================= */}
            {/* Navigation */}
            {/* ========================= */}

            <List
                sx={{
                    mt: 2,
                    px: 1.5,
                }}
            >
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.id}
                        selected={selectedMenu === item.id}
                        onClick={() =>
                            onMenuChange(item.id)
                        }
                        sx={{
                            mb: 1,

                            minHeight: 52,

                            borderRadius: 2,

                            color: "#A1A1AA",

                            transition:
                                "all 0.2s ease",

                            "& .MuiListItemIcon-root": {
                                color: "#A1A1AA",
                                minWidth: 42,
                            },

                            "& .MuiListItemText-primary": {
                                fontSize: "16px",
                                fontWeight: 500,
                            },

                            "&:hover": {
                                backgroundColor: "#171717",
                                color: "#FFFFFF",
                            },

                            "&:hover .MuiListItemIcon-root": {
                                color: "#FFFFFF",
                            },

                            "&.Mui-selected": {
                                backgroundColor: "#6366F1",
                                color: "#FFFFFF",
                            },

                            "&.Mui-selected .MuiListItemIcon-root": {
                                color: "#FFFFFF",
                            },

                            "&.Mui-selected:hover": {
                                backgroundColor: "#5558E8",
                            },
                        }}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.text}
                        />
                    </ListItemButton>
                ))}
            </List>

            {/* Push footer down */}
            <Box sx={{ flexGrow: 1 }} />

            {/* ========================= */}
            {/* Footer */}
            {/* ========================= */}

            <Divider
                sx={{
                    borderColor: "#202020",
                }}
            />

            <Box
                sx={{
                    p: 2.5,
                    textAlign: "center",
                    backgroundColor: "#0B0B0B",
                }}
            >
                <Typography
                    sx={{
                        color: "#E5E7EB",
                        fontWeight: 600,
                        fontSize: "15px",
                    }}
                >
                    AI Document Assistant
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        color: "#52525B",
                        display: "block",
                        mt: 0.5,
                    }}
                >
                    Version 1.0.0
                </Typography>
            </Box>
        </Drawer>
    );
}