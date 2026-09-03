import { useRef, useState } from "react";
import axios from "axios";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import SlideshowRoundedIcon from "@mui/icons-material/SlideshowRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";

import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";
import MovieCreationRoundedIcon from "@mui/icons-material/MovieCreationRounded";

import { useModel } from "../context/ModelContext";
import { generateSummary } from "../services/summaryService";
import { generateDiagram } from "../services/diagramService";
import { useNavigate } from "react-router-dom";

interface Props {
    documentId: string;
    onFileSelect?: (file: File) => void;
    onSend?: (message: string, response: string) => void;
}

export default function ChatInput({
    documentId,
    onFileSelect,
    onSend,
}: Props) {
    const { model, setModel } = useModel();
    const navigate = useNavigate();

    const inputRef = useRef<HTMLInputElement>(null);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [anchorEl, setAnchorEl] =
        useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const closeMenu = () => {
        setAnchorEl(null);
    };

    // ======================================
    // SEND CHAT
    // ======================================

    const handleSend = async () => {
        if (!message.trim()) {
            alert("Please enter your question.");
            return;
        }

        if (!documentId) {
            alert("Please upload a document first.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/chat",
                {
                    documentId,
                    message,
                    model,
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.error || "Chat failed."
                );
            }

            onSend?.(
                message,
                response.data.answer
            );

            setMessage("");
        } catch (err: any) {
            alert(
                err.response?.data?.error ||
                err.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // AI SUMMARY
    // ======================================

    const handleSummary = async () => {
        if (!documentId) {
            alert("Upload a document first.");
            return;
        }

        closeMenu();

        try {
            setLoading(true);

            const data =
                await generateSummary(documentId);

            onSend?.(
                "Generate Summary",
                data.summary
            );
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // AI DIAGRAM
    // ======================================

    const handleDiagram = async () => {
        if (!documentId) {
            alert("Upload a document first.");
            return;
        }

        closeMenu();

        try {
            setLoading(true);

            const data =
                await generateDiagram(documentId);

            onSend?.(
                "Generate Diagram",
                data.diagram
            );
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };
    // ======================================
    // SPEECH TO TEXT
    // ======================================

    const handleSpeech = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                "Speech Recognition is not supported in this browser."
            );
            return;
        }

        const recognition =
            new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            setMessage(
                event.results[0][0].transcript
            );
        };

        recognition.start();
    };

    // ======================================
    // TRANSLATE
    // ======================================

    const handleTranslate = () => {
        closeMenu();

        navigate("/translate");
    };


    // ======================================
    // IMAGE GENERATION
    // ======================================

    const handleImageGeneration = () => {
        closeMenu();

        navigate("/image-generation");
    };

    // ======================================
    // INTERVIEW BOT
    // ======================================

    const handleInterviewBot = () => {
        closeMenu();

        navigate("/interview");
    };


    // ======================================
    // VIDEO GENERATION
    // ======================================

    const handleVideoGeneration = () => {
        closeMenu();
        navigate("/video-generation");
        closeMenu();


    };

    // ======================================
    // RETURN
    // ======================================

    return (
        <>
            {/* ======================================
                CHAT INPUT
            ====================================== */}

            <Paper
                elevation={0}
                sx={{
                    mx: { xs: 1.5, md: 3 },
                    mb: { xs: 1.5, md: 3 },
                    px: 1.5,
                    py: 1.2,

                    display: "flex",
                    alignItems: "center",
                    gap: 1,

                    borderRadius: "18px",

                    backgroundColor: "#000000",

                    border:
                        "1px solid #27272A",

                    boxShadow:
                        "0 8px 30px rgba(0,0,0,0.45)",

                    transition:
                        "border-color 0.2s ease, box-shadow 0.2s ease",

                    "&:focus-within": {
                        borderColor: "#6366F1",

                        boxShadow:
                            "0 0 0 3px rgba(99,102,241,0.10), 0 10px 35px rgba(0,0,0,0.45)",
                    },
                }}
            >
                {/* ==================================
                    HIDDEN FILE INPUT
                ================================== */}

                <input
                    hidden
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={(e) => {
                        const file =
                            e.target.files?.[0];

                        if (file) {
                            onFileSelect?.(file);
                        }
                    }}
                />

                {/* ==================================
                    ADD BUTTON
                ================================== */}

                <IconButton
                    onClick={(e) =>
                        setAnchorEl(e.currentTarget)
                    }
                    sx={{
                        color: "#A1A1AA",

                        "&:hover": {
                            color: "#FFFFFF",
                            backgroundColor: "#18181B",
                        },
                    }}
                >
                    <AddRoundedIcon />
                </IconButton>

                {/* ==================================
                    MICROPHONE
                ================================== */}

                <IconButton
                    onClick={handleSpeech}
                    sx={{
                        color: "#A1A1AA",

                        "&:hover": {
                            color: "#818CF8",
                            backgroundColor: "#18181B",
                        },
                    }}
                >
                    <MicRoundedIcon />
                </IconButton>

                {/* ==================================
                    MESSAGE INPUT
                ================================== */}

                <InputBase
                    sx={{
                        flex: 1,
                        px: 1,

                        color: "#FFFFFF",

                        "& input": {
                            color: "#FFFFFF",
                        },

                        "& input::placeholder": {
                            color: "#71717A",
                            opacity: 1,
                        },
                    }}
                    placeholder="Ask anything about your document..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (
                            e.key === "Enter" &&
                            !loading
                        ) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />

                {/* ==================================
                    MODEL SELECTOR
                ================================== */}

                <FormControl
                    size="small"
                    sx={{
                        width: 150,

                        "& .MuiOutlinedInput-root": {
                            color: "#FFFFFF",
                            backgroundColor: "#111111",
                            borderRadius: 2,

                            "& fieldset": {
                                borderColor: "#27272A",
                            },

                            "&:hover fieldset": {
                                borderColor: "#3F3F46",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: "#6366F1",
                            },
                        },

                        "& .MuiSelect-icon": {
                            color: "#A1A1AA",
                        },
                    }}
                >
                    <Select
                        value={model}
                        onChange={(e) =>
                            setModel(e.target.value)
                        }
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    bgcolor: "#0A0A0A",
                                    color: "#FFFFFF",
                                    border:
                                        "1px solid #27272A",

                                    "& .MuiMenuItem-root": {
                                        color: "#D4D4D8",

                                        "&:hover": {
                                            bgcolor:
                                                "#18181B",
                                        },

                                        "&.Mui-selected": {
                                            bgcolor:
                                                "rgba(99,102,241,0.15)",
                                            color: "#A5B4FC",
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value="gemini-flash">
                            Gemini Flash
                        </MenuItem>

                        <MenuItem value="groq-llama">
                            Groq Llama
                        </MenuItem>

                        <MenuItem value="huggingface">
                            Hugging Face
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* ==================================
                    SEND BUTTON
                ================================== */}

                <IconButton
                    disabled={loading}
                    onClick={handleSend}
                    sx={{
                        width: 42,
                        height: 42,

                        color: "#FFFFFF",

                        background:
                            "linear-gradient(135deg, #6366F1, #8B5CF6)",

                        "&:hover": {
                            background:
                                "linear-gradient(135deg, #4F46E5, #7C3AED)",
                        },

                        "&.Mui-disabled": {
                            backgroundColor: "#27272A",
                            color: "#71717A",
                        },
                    }}
                >
                    {loading ? (
                        <CircularProgress
                            size={21}
                            sx={{
                                color: "#FFFFFF",
                            }}
                        />
                    ) : (
                        <SendRoundedIcon />
                    )}
                </IconButton>
            </Paper>
            {/* ======================================
                ADD / FEATURES MENU
            ====================================== */}

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                PaperProps={{
                    sx: {
                        bgcolor: "#0A0A0A",
                        color: "#FFFFFF",

                        border:
                            "1px solid #27272A",

                        borderRadius: 2,

                        boxShadow:
                            "0 15px 40px rgba(0,0,0,0.55)",

                        "& .MuiMenuItem-root": {
                            color: "#D4D4D8",
                            borderRadius: 1,

                            "&:hover": {
                                bgcolor: "#18181B",
                                color: "#FFFFFF",
                            },
                        },

                        "& .MuiDivider-root": {
                            borderColor: "#27272A",
                        },

                        "& .MuiListItemIcon-root": {
                            minWidth: 38,
                        },
                    },
                }}
            >
                {/* ======================================
                    UPLOAD DOCUMENT
                ====================================== */}

                <MenuItem
                    onClick={() => {
                        inputRef.current?.click();
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <DescriptionRoundedIcon
                            sx={{
                                color: "#60A5FA",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="Upload Document"
                    />
                </MenuItem>

                {/* ======================================
                    UPLOAD PDF
                ====================================== */}

                <MenuItem
                    onClick={() => {
                        inputRef.current?.click();
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <PictureAsPdfRoundedIcon
                            sx={{
                                color: "#EF4444",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="Upload PDF"
                    />
                </MenuItem>

                {/* ======================================
                    UPLOAD EXCEL
                ====================================== */}

                <MenuItem
                    onClick={() => {
                        inputRef.current?.click();
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <TableChartRoundedIcon
                            sx={{
                                color: "#22C55E",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="Upload Excel"
                    />
                </MenuItem>

                {/* ======================================
                    UPLOAD POWERPOINT
                ====================================== */}

                <MenuItem
                    onClick={() => {
                        inputRef.current?.click();
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <SlideshowRoundedIcon
                            sx={{
                                color: "#F97316",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="Upload PowerPoint"
                    />
                </MenuItem>

                {/* ======================================
                    UPLOAD IMAGE
                ====================================== */}

                <MenuItem
                    onClick={() => {
                        inputRef.current?.click();
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <ImageRoundedIcon
                            sx={{
                                color: "#A78BFA",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="Upload Image"
                    />
                </MenuItem>

                <Divider />

                {/* ======================================
                    AI FEATURES
                ====================================== */}

                <MenuItem onClick={handleTranslate}>
                    <ListItemIcon>
                        <TranslateRoundedIcon
                            sx={{
                                color: "#38BDF8",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="Translate"
                    />
                </MenuItem>

                <MenuItem onClick={handleSummary}>
                    <ListItemIcon>
                        <AutoAwesomeRoundedIcon
                            sx={{
                                color: "#22C55E",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="AI Summary"
                    />
                </MenuItem>

                <MenuItem onClick={handleDiagram}>
                    <ListItemIcon>
                        <AccountTreeRoundedIcon
                            sx={{
                                color: "#F59E0B",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="AI Diagram"
                    />
                </MenuItem>

                <MenuItem
                    onClick={handleImageGeneration}
                >
                    <ListItemIcon>
                        <ImageRoundedIcon
                            sx={{
                                color: "#A78BFA",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="AI Image Generation"
                    />
                </MenuItem>

                <Divider />

                {/* ======================================
                    ADVANCED AI
                ====================================== */}

                <MenuItem onClick={handleSpeech}>
                    <ListItemIcon>
                        <RecordVoiceOverRoundedIcon
                            sx={{
                                color: "#EF4444",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="Speech To Text"
                    />
                </MenuItem>

                <MenuItem
                    onClick={handleInterviewBot}
                >
                    <ListItemIcon>
                        <SmartToyRoundedIcon
                            sx={{
                                color: "#22C55E",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="AI Interview Bot"
                    />
                </MenuItem>

                <MenuItem
                    onClick={handleVideoGeneration}
                >
                    <ListItemIcon>
                        <MovieCreationRoundedIcon
                            sx={{
                                color: "#60A5FA",
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="AI Video Generation"
                    />
                </MenuItem>
            </Menu>
        </>
    );
}