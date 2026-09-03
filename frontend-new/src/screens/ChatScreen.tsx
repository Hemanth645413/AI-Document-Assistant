import Box from "@mui/material/Box";

import Conversation from "../components/Conversation";
import ChatInput from "../components/ChatInput";
import PreviewPanel from "../components/PreviewPanel";
import FileChip from "../components/FileChip";

interface ChatMessage {
    message: string;
    response: string;
}

interface Props {
    history: ChatMessage[];
    selectedFile: File | null;
    uploading: boolean;
    documentId: string;
    onFileSelect: (file: File) => void;
    onSend: (message: string, response: string) => void;
    removeFile: () => void;
}

export default function ChatScreen({
    history,
    selectedFile,
    uploading,
    documentId,
    onFileSelect,
    onSend,
    removeFile,
}: Props) {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                minHeight: 0,
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                bgcolor: "#000000",
                color: "#FFFFFF",
            }}
        >
            {/* ==========================================
                LEFT SIDE - CHAT
            ========================================== */}

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    height: "100%",

                    display: "flex",
                    flexDirection: "column",

                    overflow: "hidden",

                    bgcolor: "#000000",
                }}
            >
                {/* File Chip */}

                {selectedFile && (
                    <Box
                        sx={{
                            flexShrink: 0,
                        }}
                    >
                        <FileChip
                            fileName={
                                uploading
                                    ? `Uploading ${selectedFile.name}...`
                                    : selectedFile.name
                            }
                            onRemove={removeFile}
                        />
                    </Box>
                )}

                {/* Conversation */}

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "hidden",
                    }}
                >
                    <Conversation
                        history={history}
                    />
                </Box>

                {/* Chat Input */}

                <Box
                    sx={{
                        flexShrink: 0,
                        width: "100%",
                    }}
                >
                    <ChatInput
                        documentId={documentId}
                        onFileSelect={onFileSelect}
                        onSend={onSend}
                    />
                </Box>
            </Box>

            {/* ==========================================
                RIGHT SIDE - DOCUMENT PREVIEW
            ========================================== */}

            {selectedFile && (
                <Box
                    sx={{
                        width: {
                            xs: 0,
                            md: 340,
                        },

                        minWidth: {
                            xs: 0,
                            md: 340,
                        },

                        height: "100%",
                        minHeight: 0,

                        bgcolor: "#0B0B0B",

                        borderLeft:
                            "1px solid #27272A",

                        color: "#FFFFFF",

                        overflowY: "auto",
                        overflowX: "hidden",

                        display: {
                            xs: "none",
                            md: "block",
                        },

                        flexShrink: 0,
                    }}
                >
                    <PreviewPanel
                        file={selectedFile}
                    />
                </Box>
            )}
        </Box>
    );
}