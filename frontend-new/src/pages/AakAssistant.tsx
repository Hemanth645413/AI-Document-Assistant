import { useState } from "react";
import Box from "@mui/material/Box";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";

import ChatScreen from "../screens/ChatScreen";
import DocumentsScreen from "../screens/DocumentsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { uploadDocument } from "../services/uploadService";
import { supabase } from "../services/supabase";

interface ChatMessage {
    message: string;
    response: string;
}

export default function AakAssistant() {
    // ============================
    // Sidebar
    // ============================

    const [selectedMenu, setSelectedMenu] = useState("chat");

    // ============================
    // Chat
    // ============================

    const [history, setHistory] = useState<ChatMessage[]>([]);

    // ============================
    // File Upload
    // ============================

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [uploading, setUploading] = useState(false);

    const [documentId, setDocumentId] = useState("");

    // ============================
    // Upload File
    // ============================

    const handleFileSelect = async (file: File) => {
        setSelectedFile(file);
        setUploading(true);

        try {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) {
                alert("Please login first.");
                return;
            }

            const response = await uploadDocument(file, user.id);

            if (!response.success) {
                throw new Error(response.error || "Upload failed.");
            }

            if (!response.documentId) {
                throw new Error("Document ID not returned.");
            }

            setDocumentId(response.documentId);

            alert("✅ File uploaded successfully.");
        } catch (err: any) {
            console.error(err);

            alert(err.message || "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    // ============================
    // Chat Send
    // ============================

    const handleSend = (
        message: string,
        response: string
    ) => {
        setHistory((prev) => [
            ...prev,
            {
                message,
                response,
            },
        ]);
    };

    // ============================
    // Remove File
    // ============================

    const removeFile = () => {
        setSelectedFile(null);
        setDocumentId("");
    };

    // ============================
    // UI
    // ============================

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                bgcolor: "#000000",
            }}
        >
            <Sidebar
                selectedMenu={selectedMenu}
                onMenuChange={setSelectedMenu}
            />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    minWidth: 0,
                    minHeight: 0,
                    bgcolor: "#000000",
                }}
            >
                <ChatHeader />

                {selectedMenu === "chat" && (
                    <ChatScreen
                        history={history}
                        selectedFile={selectedFile}
                        uploading={uploading}
                        documentId={documentId}
                        onFileSelect={handleFileSelect}
                        onSend={handleSend}
                        removeFile={removeFile}
                    />
                )}

                {selectedMenu === "documents" && (
                    <DocumentsScreen />
                )}

                {selectedMenu === "history" && (
                    <HistoryScreen />
                )}

                {selectedMenu === "settings" && (
                    <SettingsScreen />
                )}
            </Box>
        </Box>
    );
}