import { useState } from "react";
import {
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Link,
    Box,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter Email and Password");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Login Successful!");
            navigate("/dashboard");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={6}
                sx={{
                    mt: 8,
                    p: 5,
                    borderRadius: 3,
                }}
            >
                <Typography
                    variant="h3"
                    color="primary"
                    align="center"
                    gutterBottom
                >
                    AI Document Assistant
                </Typography>

                <Typography align="center" sx={{ mb: 3 }}>
                    Login to continue
                </Typography>

                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Box sx={{ mt: 3 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleLogin}
                    >
                        LOGIN
                    </Button>
                </Box>

                <Typography align="center" sx={{ mt: 3 }}>
                    Don't have an account?{" "}
                    <Link
                        component={RouterLink}
                        to="/register"
                        underline="hover"
                    >
                        Register
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}

export default Login;