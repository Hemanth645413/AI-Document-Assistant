import { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const drawerWidth = 240;

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "Documents",
    icon: <DescriptionOutlinedIcon />,
  },
  {
    label: "AI Chat",
    icon: <ChatOutlinedIcon />,
  },
  {
    label: "History",
    icon: <HistoryOutlinedIcon />,
  },
  {
    label: "Settings",
    icon: <SettingsOutlinedIcon />,
  },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#ffffff",
            borderRight: "1px solid #e5e7eb",
          },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            AI Document
          </Typography>
        </Toolbar>

        <Divider />

        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 2,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Right Side */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "#ffffff",
            color: "#000",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                AI Document Assistant
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Upload • Search • Summarize • Chat
              </Typography>
            </Box>

            <Avatar
              sx={{
                bgcolor: "#1976d2",
              }}
            >
              H
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          sx={{
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}