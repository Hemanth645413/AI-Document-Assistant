const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const supabase = require("../config/supabase");
const extractText = require("../utils/documentReader");

const router = express.Router();

// =====================================
// Configure Multer Storage
// =====================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// =====================================
// Supported File Types
// =====================================
const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
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

// =====================================
// Test Route
// =====================================
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Upload Route Working 🚀",
    });
});

// =====================================
// Upload Route
// =====================================
router.post("/", upload.single("file"), async (req, res) => {

    console.log("🔥 Upload API Hit");

    try {

        console.log("\n====================================");
        console.log("📤 Upload Request Received");
        console.log("====================================");

        const { user_id } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        console.log("👤 User ID :", user_id);
        console.log("📄 File    :", req.file.originalname);

        // =====================================
        // Read uploaded file
        // =====================================
        const fileBuffer = fs.readFileSync(req.file.path);

        const storagePath = `private/${req.file.filename}`;

        console.log("\n⬆ Uploading file to Supabase Storage...");

        const {
            data: storageData,
            error: storageError,
        } = await supabase.storage
            .from("documents")
            .upload(storagePath, fileBuffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        console.log("Storage Data:", storageData);

        if (storageError) {
            console.error(storageError);
            throw storageError;
        }

        console.log("✅ Storage Upload Successful");

        // =====================================
        // Get Public URL
        // =====================================
        const { data: publicUrlData } = supabase.storage
            .from("documents")
            .getPublicUrl(storagePath);

        const fileUrl = publicUrlData.publicUrl;

        // =====================================
        // Extract Text
        // =====================================
        console.log("\n📖 Extracting document text...");

        const extractedText = await extractText(req.file.path);

        console.log("✅ Text Extraction Completed");
        console.log("Characters:", extractedText.length);

        // =====================================
        // Save into Database
        // =====================================
        console.log("\n💾 Saving document details into database...");

        const {
            data: insertData,
            error: insertError,
        } = await supabase
            .from("documents")
            .insert([
                {
                    user_id,
                    file_name: req.file.originalname,
                    file_type: req.file.mimetype,
                    file_size: req.file.size,
                    file_url: fileUrl,
                    document_text: extractedText,
                },
            ])
            .select();

        console.log("Insert Data:", insertData);

        if (insertError) {
            console.error(insertError);
            throw insertError;
        }

        console.log("✅ Database Insert Successful");

        // =====================================
        // Delete Temporary File
        // =====================================
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.log("🗑 Temporary file deleted");
        }

        console.log("\n====================================");
        console.log("🎉 Upload Completed Successfully");
        console.log("====================================\n");

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully!",
            documentId: insertData[0].id,
            fileName: req.file.originalname,
            fileUrl,
            extractedTextLength: extractedText.length,
        });

    } catch (err) {

        console.error("\n====================================");
        console.error("❌ UPLOAD FAILED");
        console.error("====================================");
        console.error(err);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            error: err.message,
        });

    }

});

module.exports = router;