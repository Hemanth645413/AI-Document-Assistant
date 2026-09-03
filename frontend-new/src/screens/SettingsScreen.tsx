import {
    Box,
    Typography,
    Paper,
    Avatar,
    Divider,
    Switch,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
    Button,
    Stack,
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

export default function SettingsScreen() {
    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,

                backgroundColor: "#000000",
                color: "#FFFFFF",

                p: 4,

                overflowY: "auto",

                "&::-webkit-scrollbar": {
                    width: 8,
                },

                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#000000",
                },

                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#27272A",
                    borderRadius: 10,
                },

                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#3F3F46",
                },
            }}
        >
            {/* ======================================
                HEADER
            ====================================== */}

            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#FFFFFF",
                        mb: 0.5,
                    }}
                >
                    ⚙️ Settings
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#71717A",
                    }}
                >
                    Manage your profile, AI preferences and security
                </Typography>
            </Box>

            <Stack spacing={4}>

                {/* ======================================
                    USER PROFILE
                ====================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,

                        borderRadius: 4,

                        backgroundColor: "#090909",
                        backgroundImage: "none",

                        color: "#FFFFFF",

                        border: "1px solid #27272A",

                        "&:hover": {
                            borderColor: "#3F3F46",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            mb: 3,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 70,
                                height: 70,

                                background:
                                    "linear-gradient(135deg, #6366F1, #8B5CF6)",

                                color: "#FFFFFF",

                                boxShadow:
                                    "0 8px 25px rgba(99,102,241,0.25)",
                            }}
                        >
                            <PersonRoundedIcon fontSize="large" />
                        </Avatar>

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "#FFFFFF",
                                }}
                            >
                                User Profile
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#A1A1AA",
                                    mt: 0.5,
                                }}
                            >
                                Manage your account information
                            </Typography>
                        </Box>
                    </Box>

                    <TextField
                        fullWidth
                        label="Full Name"
                        defaultValue="Hemanth"
                        sx={{
                            mb: 2,

                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#0F0F10",
                                color: "#FFFFFF",

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

                            "& .MuiInputLabel-root": {
                                color: "#A1A1AA",
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#8B5CF6",
                            },

                            "& input": {
                                color: "#FFFFFF",
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        defaultValue="user@example.com"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#0F0F10",
                                color: "#FFFFFF",

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

                            "& .MuiInputLabel-root": {
                                color: "#A1A1AA",
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#8B5CF6",
                            },

                            "& input": {
                                color: "#FFFFFF",
                            },
                        }}
                    />
                </Paper>

                {/* ======================================
                    AI SETTINGS
                ====================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,

                        borderRadius: 4,

                        backgroundColor: "#090909",
                        backgroundImage: "none",

                        color: "#FFFFFF",

                        border: "1px solid #27272A",

                        "&:hover": {
                            borderColor: "#3F3F46",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <SmartToyRoundedIcon
                            sx={{
                                color: "#8B5CF6",
                                fontSize: 30,
                            }}
                        />

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "#FFFFFF",
                                }}
                            >
                                AI Settings
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#71717A",
                                }}
                            >
                                Configure your preferred AI model
                            </Typography>
                        </Box>
                    </Box>

                    <Typography
                        sx={{
                            color: "#D4D4D8",
                            mb: 1,
                            fontWeight: 500,
                        }}
                    >
                        Default AI Model
                    </Typography>

                    <Select
                        fullWidth
                        defaultValue="gemini"
                        sx={{
                            backgroundColor: "#0F0F10",
                            color: "#FFFFFF",
                            borderRadius: 2,

                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#27272A",
                            },

                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3F3F46",
                            },

                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#6366F1",
                            },

                            "& .MuiSvgIcon-root": {
                                color: "#A1A1AA",
                            },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: "#151515",
                                    color: "#FFFFFF",
                                    border: "1px solid #27272A",

                                    "& .MuiMenuItem-root": {
                                        color: "#D4D4D8",

                                        "&:hover": {
                                            backgroundColor: "#18181B",
                                            color: "#FFFFFF",
                                        },

                                        "&.Mui-selected": {
                                            backgroundColor: "#27272A",
                                            color: "#FFFFFF",
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value="gemini">
                            Gemini
                        </MenuItem>

                        <MenuItem value="groq">
                            Groq
                        </MenuItem>

                        <MenuItem value="deepseek">
                            DeepSeek
                        </MenuItem>

                        <MenuItem value="huggingface">
                            Hugging Face
                        </MenuItem>
                    </Select>
                </Paper>

                {/* ======================================
                    APPEARANCE
                ====================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,

                        borderRadius: 4,

                        backgroundColor: "#090909",
                        backgroundImage: "none",

                        color: "#FFFFFF",

                        border: "1px solid #27272A",

                        "&:hover": {
                            borderColor: "#3F3F46",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <PaletteRoundedIcon
                            sx={{
                                color: "#8B5CF6",
                                fontSize: 30,
                            }}
                        />

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "#FFFFFF",
                                }}
                            >
                                Appearance
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#71717A",
                                }}
                            >
                                Customize the application experience
                            </Typography>
                        </Box>
                    </Box>

                    <Stack spacing={1}>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: "#8B5CF6",
                                        },

                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            backgroundColor: "#6366F1",
                                        },

                                        "& .MuiSwitch-track": {
                                            backgroundColor: "#3F3F46",
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        color: "#D4D4D8",
                                    }}
                                >
                                    Enable Dark Mode
                                </Typography>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: "#8B5CF6",
                                        },

                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            backgroundColor: "#6366F1",
                                        },

                                        "& .MuiSwitch-track": {
                                            backgroundColor: "#3F3F46",
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        color: "#D4D4D8",
                                    }}
                                >
                                    Enable Animations
                                </Typography>
                            }
                        />
                    </Stack>
                </Paper>

                {/* ======================================
                    SECURITY
                ====================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,

                        borderRadius: 4,

                        backgroundColor: "#090909",
                        backgroundImage: "none",

                        color: "#FFFFFF",

                        border: "1px solid #27272A",

                        "&:hover": {
                            borderColor: "#3F3F46",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <SecurityRoundedIcon
                            sx={{
                                color: "#8B5CF6",
                                fontSize: 30,
                            }}
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: "#FFFFFF",
                            }}
                        >
                            Security
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            color: "#A1A1AA",
                            lineHeight: 1.8,
                        }}
                    >
                        Password, authentication, and account security
                        settings will be available here.
                    </Typography>
                </Paper>

                {/* ======================================
                    SAVE
                ====================================== */}

                <Divider
                    sx={{
                        borderColor: "#27272A",
                    }}
                />

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<SaveRoundedIcon />}
                    sx={{
                        alignSelf: "flex-start",

                        borderRadius: 3,

                        px: 5,
                        py: 1.4,

                        color: "#FFFFFF",

                        fontWeight: 600,

                        background:
                            "linear-gradient(135deg, #6366F1, #8B5CF6)",

                        "&:hover": {
                            background:
                                "linear-gradient(135deg, #4F46E5, #7C3AED)",
                        },
                    }}
                >
                    Save Changes
                </Button>
            </Stack>
        </Box>
    );
}