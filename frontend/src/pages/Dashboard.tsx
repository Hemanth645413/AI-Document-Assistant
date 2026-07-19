import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

import Layout from "../components/Layout";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import AIChat from "../components/AIChat";

function Dashboard() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            navigate("/");
            return;
        }

        setUserEmail(user.email ?? "");
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <Layout>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Welcome 👋
                </Typography>

                <Typography color="text.secondary">
                    {userEmail}
                </Typography>
            </Box>

            {/* Upload + AI Chat */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "1fr 1fr",
                    },
                    gap: 3,
                    alignItems: "start",
                    mb: 3,
                }}
            >
                <FileUpload />
                <AIChat />
            </Box>

            {/* File List */}
            <FileList />

            {/* Logout */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                }}
            >
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Layout>
    );
}

export default Dashboard;