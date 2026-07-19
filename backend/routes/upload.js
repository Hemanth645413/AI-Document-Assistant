const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const supabase = require("../config/supabase");
const extractText = require("../utils/documentReader");

const router = express.Router();

// ===========================
// Configure Multer Storage
// ===========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// ===========================
// Allow Supported File Types
// ===========================
const fileFilter = (req, file, cb) => {
    const allowed = [
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".xls",
        ".xlsx",
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, DOC, DOCX, PPT, PPTX, XLS and XLSX files are allowed."
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
});

// ===========================
// Test Route
// ===========================
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Upload Route Working 🚀",
    });
});

// ===========================
// Upload Route
// ===========================
router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Read Uploaded File
        const fileBuffer = fs.readFileSync(req.file.path);

        // Upload to Supabase
        const { data, error } = await supabase.storage
            .from("documents")
            .upload(`private/${req.file.filename}`, fileBuffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }

        // Extract document text
        const extractedText = await extractText(req.file.path);

        // Store globally for AI Chat
        global.documentText = extractedText;
        global.documentName = req.file.originalname;

        console.log("=================================");
        console.log("📄 Document Uploaded");
        console.log("📁 File:", global.documentName);
        console.log("📑 Characters:", extractedText.length);
        console.log("=================================");

        // Remove temporary file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.json({
            success: true,
            message: "File uploaded successfully!",
            fileName: req.file.originalname,
            extractedTextLength: extractedText.length,
            storage: data,
        });
    } catch (error) {
        console.error("Upload Error:", error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;