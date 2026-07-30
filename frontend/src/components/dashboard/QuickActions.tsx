import {
    Paper,
    Typography,
    Card,
    CardActionArea,
    Box,
} from "@mui/material";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { useNavigate } from "react-router-dom";

export default function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Upload",
            icon: <UploadFileRoundedIcon sx={{ fontSize: 40 }} />,
            path: "/upload",
        },
        {
            title: "AI Chat",
            icon: <SmartToyRoundedIcon sx={{ fontSize: 40 }} />,
            path: "/chat",
        },
        {
            title: "Summary",
            icon: <SummarizeRoundedIcon sx={{ fontSize: 40 }} />,
            path: "/summary",
        },
        {
            title: "Diagram",
            icon: <AccountTreeRoundedIcon sx={{ fontSize: 40 }} />,
            path: "/diagram",
        },
        {
            title: "Generation",
            icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 40 }} />,
            path: "/generation",
        },
        {
            title: "History",
            icon: <HistoryRoundedIcon sx={{ fontSize: 40 }} />,
            path: "/history",
        },
        {
            title: "Settings",
            icon: <SettingsRoundedIcon sx={{ fontSize: 40 }} />,
            path: "/settings",
        },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                mb: 4,
            }}
        >
            <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
            >
                Quick Actions
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 2.5,
                }}
            >
                {actions.map((action) => (
                    <Card
                        key={action.title}
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            height: 150,
                            transition: "0.3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardActionArea
                            onClick={() => navigate(action.path)}
                            sx={{ height: "100%" }}
                        >
                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    p: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        color: "primary.main",
                                        mb: 2,
                                    }}
                                >
                                    {action.icon}
                                </Box>

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    {action.title}
                                </Typography>
                            </Box>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </Paper>
    );
}