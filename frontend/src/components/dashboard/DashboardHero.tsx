import { Box, Button, Stack, Typography } from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import { useNavigate } from "react-router-dom";

interface DashboardHeroProps {
    userEmail: string;
}

export default function DashboardHero({
    userEmail,
}: DashboardHeroProps) {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                p: 4,
                mb: 4,
                borderRadius: 4,
                background: "linear-gradient(135deg,#1565C0,#42A5F5)",
                color: "white",
            }}
        >
            <Typography
                variant="h4"
                fontWeight={700}
            >
                👋 Welcome Back
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    opacity: 0.9,
                }}
            >
                {userEmail}
            </Typography>

            <Typography
                sx={{
                    mt: 2,
                    fontSize: 18,
                    opacity: 0.95,
                }}
            >
                AI Document Assistant powered by Gemini, Groq & LiteLLM
            </Typography>

            <Stack
                direction="row"
                spacing={2}
                mt={3}
            >
                <Button
                    variant="contained"
                    startIcon={<CloudUploadRoundedIcon />}
                    onClick={() => navigate("/upload")}
                    sx={{
                        bgcolor: "white",
                        color: "#1565C0",
                        fontWeight: 600,
                        "&:hover": {
                            bgcolor: "#F5F5F5",
                        },
                    }}
                >
                    Upload Document
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<SmartToyRoundedIcon />}
                    onClick={() => navigate("/chat")}
                    sx={{
                        color: "white",
                        borderColor: "white",
                        fontWeight: 600,
                        "&:hover": {
                            borderColor: "white",
                            backgroundColor: "rgba(255,255,255,0.1)",
                        },
                    }}
                >
                    Ask AI
                </Button>
            </Stack>
        </Box>
    );
}