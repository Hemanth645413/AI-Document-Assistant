import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

const drawerWidth = 270;

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardRoundedIcon />,
    path: "/dashboard",
  },
  {
    label: "Documents",
    icon: <DescriptionRoundedIcon />,
    path: "/upload",
  },
  {
    label: "AI Chat",
    icon: <ChatRoundedIcon />,
    path: "/chat",
  },
  {
    label: "Generation",
    icon: <AutoAwesomeRoundedIcon />,
    path: "/generation",
  },
  {
    label: "History",
    icon: <HistoryRoundedIcon />,
    path: "/history",
  },
  {
    label: "Settings",
    icon: <SettingsRoundedIcon />,
    path: "/settings",
  },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f7fc", minHeight: "100vh" }}>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: 0,
            bgcolor: "#0f172a",
            color: "#fff",
            p: 2,
          },
        }}
      >

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 0.5 }}
        >
          AI Docs
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#94a3b8", mb: 4 }}
        >
          Enterprise Assistant
        </Typography>

        <List>

          {menuItems.map((item) => (

            <ListItemButton
              key={item.label}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 3,
                mb: 1,

                bgcolor:
                  location.pathname === item.path
                    ? "#2563eb"
                    : "transparent",

                "&:hover": {
                  bgcolor: "#1e40af",
                },
              }}
            >

              <ListItemIcon
                sx={{
                  color: "#fff",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.label} />

            </ListItemButton>

          ))}

        </List>

        <Box flexGrow={1} />

        <Divider sx={{ bgcolor: "#334155", my: 2 }} />

        <Typography variant="body2">
          Storage
        </Typography>

        <Typography color="#94a3b8">
          1.3 GB / 5 GB
        </Typography>

      </Drawer>

      <Box sx={{ flexGrow: 1 }}>

        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "#fff",
            color: "#111",
            borderBottom: "1px solid #eee",
          }}
        >
          <Toolbar>

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ flexGrow: 1 }}
            >
              AI Document Assistant
            </Typography>

            <IconButton>

              <Badge
                badgeContent={2}
                color="error"
              >
                <NotificationsNoneRoundedIcon />
              </Badge>

            </IconButton>

            <Avatar
              sx={{
                ml: 2,
                bgcolor: "#2563eb",
              }}
            >
              H
            </Avatar>

          </Toolbar>
        </AppBar>

        <Box p={4}>
          {children}
        </Box>

      </Box>

    </Box>
  );
}