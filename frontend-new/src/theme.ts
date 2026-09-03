import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",

        primary: {
            main: "#6366F1",
        },

        secondary: {
            main: "#8B5CF6",
        },

        background: {
            default: "#000000",
            paper: "#080808",
        },

        text: {
            primary: "#FFFFFF",
            secondary: "#A1A1AA",
        },

        divider: "#27272A",

        success: {
            main: "#22C55E",
        },

        error: {
            main: "#EF4444",
        },

        warning: {
            main: "#F59E0B",
        },

        info: {
            main: "#38BDF8",
        },
    },

    shape: {
        borderRadius: 12,
    },

    typography: {
        fontFamily: [
            "Inter",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif",
        ].join(","),

        h3: {
            fontWeight: 700,
        },

        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 700,
        },

        h6: {
            fontWeight: 600,
        },

        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },

    components: {
        // ==========================================
        // GLOBAL
        // ==========================================

        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    backgroundColor: "#000000",
                },

                body: {
                    margin: 0,
                    padding: 0,
                    backgroundColor: "#000000",
                    color: "#FFFFFF",
                },

                "#root": {
                    minHeight: "100vh",
                    backgroundColor: "#000000",
                },

                "*": {
                    scrollbarColor:
                        "#27272A #000000",

                    scrollbarWidth: "thin",
                },

                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },

                "*::-webkit-scrollbar-track": {
                    background: "#000000",
                },

                "*::-webkit-scrollbar-thumb": {
                    background: "#27272A",
                    borderRadius: "10px",
                },

                "*::-webkit-scrollbar-thumb:hover": {
                    background: "#3F3F46",
                },
            },
        },

        // ==========================================
        // PAPER
        // ==========================================

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#080808",
                    backgroundImage: "none",

                    border:
                        "1px solid #27272A",

                    color: "#FFFFFF",
                },
            },
        },

        // ==========================================
        // CARD
        // ==========================================

        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#080808",
                    backgroundImage: "none",

                    border:
                        "1px solid #27272A",

                    color: "#FFFFFF",

                    boxShadow: "none",
                },
            },
        },

        // ==========================================
        // APP BAR
        // ==========================================

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#000000",
                    backgroundImage: "none",

                    color: "#FFFFFF",

                    boxShadow: "none",

                    borderBottom:
                        "1px solid #27272A",
                },
            },
        },

        // ==========================================
        // DRAWER
        // ==========================================

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#080808",
                    backgroundImage: "none",

                    color: "#FFFFFF",

                    borderRight:
                        "1px solid #27272A",
                },
            },
        },

        // ==========================================
        // BUTTON
        // ==========================================

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",

                    fontWeight: 600,

                    borderRadius: 10,
                },

                containedPrimary: {
                    background:
                        "linear-gradient(135deg, #6366F1, #8B5CF6)",

                    color: "#FFFFFF",

                    "&:hover": {
                        background:
                            "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    },
                },

                outlined: {
                    borderColor: "#27272A",

                    color: "#FFFFFF",

                    "&:hover": {
                        borderColor: "#6366F1",

                        backgroundColor:
                            "rgba(99, 102, 241, 0.08)",
                    },
                },
            },
        },

        // ==========================================
        // TEXT FIELD
        // ==========================================

        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputLabel-root": {
                        color: "#A1A1AA",
                    },

                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#818CF8",
                    },
                },
            },
        },

        // ==========================================
        // OUTLINED INPUT
        // ==========================================

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "#080808",

                    color: "#FFFFFF",

                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#27272A",
                    },

                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3F3F46",
                    },

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6366F1",
                    },
                },

                input: {
                    color: "#FFFFFF",

                    "&::placeholder": {
                        color: "#71717A",

                        opacity: 1,
                    },
                },
            },
        },

        // ==========================================
        // SELECT
        // ==========================================

        MuiSelect: {
            styleOverrides: {
                root: {
                    backgroundColor: "#080808",

                    color: "#FFFFFF",
                },
            },
        },

        // ==========================================
        // ICON BUTTON
        // ==========================================

        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "#A1A1AA",

                    "&:hover": {
                        color: "#FFFFFF",

                        backgroundColor: "#18181B",
                    },
                },
            },
        },

        // ==========================================
        // DIVIDER
        // ==========================================

        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: "#27272A",
                },
            },
        },

        // ==========================================
        // CHIP
        // ==========================================

        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: "#18181B",

                    color: "#FFFFFF",

                    border:
                        "1px solid #27272A",
                },
            },
        },
    },
});

export default theme;