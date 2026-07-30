import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";

import Mermaid from "./Mermaid";

interface DocumentItem {
    id: string;
    file_name: string;
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

interface HistoryItem {
    id: string;
    question: string;
    answer: string;
    created_at: string;
    model_used: string;
}

const API = "http://localhost:5000";

export default function AakAssistant() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [selectedDocument, setSelectedDocument] =
        useState<DocumentItem | null>(null);

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [history, setHistory] = useState<HistoryItem[]>([]);

    const [summary, setSummary] = useState("");

    const [diagram, setDiagram] = useState("");

    const [model, setModel] = useState("");

    const [loading, setLoading] = useState(false);

    const [summaryLoading, setSummaryLoading] = useState(false);

    const [diagramLoading, setDiagramLoading] = useState(false);

    const [historyLoading, setHistoryLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadDocuments();
        loadHistory();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);
    const loadDocuments = async () => {
        try {
            const res = await axios.get(`${API}/upload/documents`);

            if (res.data.success) {
                setDocuments(res.data.documents);

                if (res.data.documents.length > 0) {
                    setSelectedDocument(res.data.documents[0]);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadHistory = async () => {
        try {
            setHistoryLoading(true);

            const res = await axios.get(`${API}/chat/history`);

            if (res.data.success) {
                setHistory(res.data.history);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const askAI = async () => {
        if (!selectedDocument) return;

        if (!question.trim()) return;

        const userMessage: ChatMessage = {
            role: "user",
            content: question,
        };

        setMessages((prev) => [...prev, userMessage]);

        const currentQuestion = question;

        setQuestion("");

        try {
            setLoading(true);

            const res = await axios.post(`${API}/chat`, {
                documentId: selectedDocument.id,
                message: currentQuestion,
            });

            if (res.data.success) {
                setModel(res.data.model);

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: res.data.answer,
                    },
                ]);

                loadHistory();
            }
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        err?.response?.data?.error ||
                        "Unable to get response from AI.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const generateSummary = async () => {
        if (!selectedDocument) return;

        try {
            setSummaryLoading(true);

            const res = await axios.post(`${API}/chat/summary`, {
                documentId: selectedDocument.id,
            });

            if (res.data.success) {
                setSummary(res.data.summary);
                setModel(res.data.model);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSummaryLoading(false);
        }
    };

    const generateDiagram = async () => {
        if (!selectedDocument) return;

        try {
            setDiagramLoading(true);

            const res = await axios.post(`${API}/chat/diagram`, {
                documentId: selectedDocument.id,
            });

            if (res.data.success) {
                setDiagram(res.data.diagram);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDiagramLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        setSummary("");
        setDiagram("");
        setQuestion("");
        setModel("");
    };