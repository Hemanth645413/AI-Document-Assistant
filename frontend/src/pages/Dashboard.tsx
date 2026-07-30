import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { supabase } from "../services/supabase";

import Layout from "../components/Layout";

import DashboardHero from "../components/dashboard/DashboardHero";
import StatsSection from "../components/dashboard/StatsSection";
import QuickActions from "../components/dashboard/QuickActions";
import ModelCard from "../components/dashboard/ModelCard";
import RecentDocuments from "../components/dashboard/RecentDocuments";
import RecentChats from "../components/dashboard/RecentChats";

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
            {/* Hero */}
            <DashboardHero userEmail={userEmail} />

            {/* Statistics */}
            <StatsSection />

            {/* Recent Documents + Recent AI Chats */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr",
                        lg: "1fr 1fr",
                    },
                    gap: 3,
                    mb: 4,
                    width: "100%",
                }}
            >
                <RecentDocuments />
                <RecentChats />
            </Box>

            {/* Quick Actions + AI Model */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr",
                        lg: "3fr 1fr",
                    },
                    gap: 3,
                    mb: 4,
                    width: "100%",
                }}
            >
                <QuickActions />
                <ModelCard />
            </Box>

            {/* Logout */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    mb: 3,
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