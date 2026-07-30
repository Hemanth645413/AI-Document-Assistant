import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import StatCard from "../StatCard";
import { supabase } from "../../services/supabase";

export default function StatsSection() {
    const [stats, setStats] = useState([
        { label: "Documents", value: "0", delta: 0 },
        { label: "AI Chats", value: "0", delta: 0 },
        { label: "Storage", value: "0 MB", delta: 0 },
        { label: "Summaries", value: "0", delta: 0 },
    ]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const [
            { count: documentsCount },
            { count: chatsCount },
            { count: summariesCount },
            { data: documents },
        ] = await Promise.all([
            supabase
                .from("documents")
                .select("*", { count: "exact", head: true }),

            supabase
                .from("chat_history")
                .select("*", { count: "exact", head: true }),

            supabase
                .from("summaries")
                .select("*", { count: "exact", head: true }),

            supabase
                .from("documents")
                .select("file_size"),
        ]);

        let totalSize = 0;

        if (documents) {
            documents.forEach((doc: any) => {
                totalSize += Number(doc.file_size || 0);
            });
        }

        const storageMB = (totalSize / (1024 * 1024)).toFixed(2);

        setStats([
            {
                label: "Documents",
                value: String(documentsCount ?? 0),
                delta: 0,
            },
            {
                label: "AI Chats",
                value: String(chatsCount ?? 0),
                delta: 0,
            },
            {
                label: "Storage",
                value: `${storageMB} MB`,
                delta: 0,
            },
            {
                label: "Summaries",
                value: String(summariesCount ?? 0),
                delta: 0,
            },
        ]);
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2,1fr)",
                    lg: "repeat(4,1fr)",
                },
                gap: 3,
                mb: 4,
            }}
        >
            {stats.map((stat) => (
                <StatCard
                    key={stat.label}
                    stat={stat}
                />
            ))}
        </Box>
    );
}