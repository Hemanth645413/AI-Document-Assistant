import { useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { supabase } from "../services/supabase";

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Registration successful! Please check your email for verification.");
            console.log(data);
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
                    variant="h4"
                    align="center"
                    gutterBottom
                    color="primary"
                >
                    AI Document Assistant
                </Typography>

                <Typography
                    variant="body1"
                    align="center"
                    sx={{ mb: 3 }}
                >
                    Create your account
                </Typography>

                <TextField
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleRegister}
                    >
                        Register
                    </Button>
                </Box>

                <Typography
                    align="center"
                    sx={{ mt: 3 }}
                >
                    Already have an account?{" "}
                    <Link
                        component={RouterLink}
                        to="/"
                        underline="hover"
                    >
                        Login
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}

export default Register;