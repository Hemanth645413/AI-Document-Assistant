import { useState } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // =====================================
    // Login
    // =====================================

    const handleLogin = async () => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            alert(error.message);
            return;
        }

        alert("✅ Login Successful");
        navigate("/dashboard");
    };

    // =====================================
    // UI
    // =====================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#000000",
                p: 3,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 550,
                    p: 5,
                    borderRadius: 4,
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    border: "1px solid #27272A",
                    boxShadow:
                        "0 15px 40px rgba(0, 0, 0, 0.6)",
                }}
            >
                {/* =====================================
                    TITLE
                ===================================== */}

                <Typography
                    variant="h3"
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1.2,
                        mb: 5,
                        letterSpacing: "-0.5px",
                    }}
                >
                    AI Document
                    <br />
                    Assistant
                </Typography>

                {/* =====================================
                    FORM
                ===================================== */}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    {/* EMAIL */}

                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        sx={{
                            "& .MuiInputLabel-root": {
                                color: "#FFFFFF",
                                backgroundColor: "#000000",
                                px: 0.5,
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#FFFFFF",
                            },

                            "& .MuiOutlinedInput-root": {
                                color: "#FFFFFF",

                                // BLUE EMAIL FIELD
                                backgroundColor: "#2F75A8",

                                "& fieldset": {
                                    borderColor: "#3B82F6",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#60A5FA",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#60A5FA",
                                },
                            },

                            "& .MuiOutlinedInput-input": {
                                color: "#FFFFFF",
                            },
                        }}
                    />

                    {/* PASSWORD */}

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        sx={{
                            "& .MuiInputLabel-root": {
                                color: "#FFFFFF",
                                backgroundColor: "#000000",
                                px: 0.5,
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#FFFFFF",
                            },

                            "& .MuiOutlinedInput-root": {
                                color: "#FFFFFF",

                                // BLUE PASSWORD FIELD
                                backgroundColor: "#2F75A8",

                                "& fieldset": {
                                    borderColor: "#3B82F6",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#60A5FA",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#60A5FA",
                                },
                            },

                            "& .MuiOutlinedInput-input": {
                                color: "#FFFFFF",
                            },
                        }}
                    />

                    {/* LOGIN BUTTON */}

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleLogin}
                        disabled={loading}
                        sx={{
                            mt: 1,
                            height: 52,
                            borderRadius: 2,
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#FFFFFF",

                            background:
                                "linear-gradient(135deg, #6366F1, #8B5CF6)",

                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #4F46E5, #7C3AED)",
                            },

                            "&:disabled": {
                                color: "#FFFFFF",
                                opacity: 0.6,
                            },
                        }}
                    >
                        {loading
                            ? "Signing In..."
                            : "Login"}
                    </Button>
                </Box>

                {/* =====================================
                    REGISTER
                ===================================== */}

                <Typography
                    textAlign="center"
                    sx={{
                        mt: 4,
                        color: "#D4D4D8",
                    }}
                >
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        style={{
                            color: "#A78BFA",
                            fontWeight: 600,
                            textDecoration: "underline",
                        }}
                    >
                        Register
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}