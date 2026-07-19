const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");
const uploadRoutes = require("./routes/upload");
const chatRoutes = require("./routes/chat");

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
    res.send("AI Document Assistant Backend is Running 🚀");
});

// =========================
// Status API
// =========================
app.get("/api/status", (req, res) => {
    res.json({
        status: "success",
        message: "Backend is running successfully",
        version: "1.0.0",
    });
});

// =========================
// Files API
// =========================
app.get("/api/files", async (req, res) => {
    try {
        const { data, error } = await supabase.storage
            .from("documents")
            .list();

        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }

        res.json({
            success: true,
            files: data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

// =========================
// AI Test Route
// =========================
app.get("/api/ai", (req, res) => {
    res.json({
        success: true,
        message: "Groq AI is Ready 🚀",
    });
});

// =========================
// 404 Handler
// =========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found",
    });
});

// =========================
// Error Handler
// =========================
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});