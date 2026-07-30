import { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";

import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import { supabase } from "../../services/supabase";

interface ChatItem {
    id: string;
    question: string;
    created_at: string;
}

export default function RecentChats() {
    const [chats, setChats] = useState<ChatItem[]>([]);

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        const { data, error } = await supabase
            .from("chat_history")
            .select("id, question, created_at")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) {
            console.error(error);
            return;
        }

        setChats(data || []);
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const created = new Date(date);

        const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);

        if (seconds < 60) return "Just now";

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                height: "100%",
            }}
        >
            <Typography variant="h5" fontWeight={700}>
                Recent AI Chats
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                Your latest AI conversations
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
                {chats.length === 0 ? (
                    <Typography
                        color="text.secondary"
                        sx={{
                            textAlign: "center",
                            py: 4,
                        }}
                    >
                        No AI chats found.
                    </Typography>
                ) : (
                    chats.map((chat) => (
                        <ListItem
                            key={chat.id}
                            sx={{
                                px: 0,
                                py: 1.5,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: "#1976D2",
                                    }}
                                >
                                    <SmartToyRoundedIcon />
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Typography
                                        fontWeight={600}
                                        noWrap
                                    >
                                        {chat.question}
                                    </Typography>
                                }
                                secondary={getTimeAgo(chat.created_at)}
                            />

                            <Box>
                                <Chip
                                    label="Completed"
                                    color="success"
                                    size="small"
                                />
                            </Box>
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );
}