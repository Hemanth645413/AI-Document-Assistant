const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const supabase = require("../config/supabase");
const extractText = require("../utils/documentReader");
const chunkText = require("../utils/chunktext");
const generateEmbedding = require("../services/embeddingService");

const router = express.Router();

console.log("✅ upload.js loaded");

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
// Configure Multer Storage
// =====================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const uploadDir = path.join(__dirname, "../uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_")
        );
    },

});

// =====================================
// File Filter
// =====================================

const fileFilter = (req, file, cb) => {

    const allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF and DOCX files are allowed."
            )
        );
    }
};

// =====================================
// Multer Upload Configuration
// =====================================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 20 * 1024 * 1024,
    },

});

// =====================================
// Upload API
// POST /api/upload
// =====================================

router.post(
    "/",
    upload.single("file"),
    async (req, res) => {

        console.log("====================================");
        console.log("🔥 Upload API Hit");
        console.log("====================================");

        let localFilePath = null;

        try {

            // =====================================
            // Validate File
            // =====================================

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    error: "No file uploaded.",
                });

            }

            localFilePath = req.file.path;

            console.log(
                "📄 File Name:",
                req.file.originalname
            );

            console.log(
                "👤 User ID:",
                req.body.user_id
            );

            // =====================================
            // Extract Document Text
            // =====================================

            console.log("📖 Extracting document text...");

            const extractedText =
                await extractText(localFilePath);

            if (
                !extractedText ||
                !extractedText.trim()
            ) {

                return res.status(400).json({
                    success: false,
                    error:
                        "Could not extract text from the document.",
                });

            }

            console.log(
                "✅ Text Extraction Completed"
            );

            console.log(
                "Characters:",
                extractedText.length
            );

            // =====================================
            // Read Uploaded File
            // =====================================

            const fileBuffer =
                fs.readFileSync(localFilePath);

            const storagePath =
                `${Date.now()}-${req.file.originalname}`;

            // =====================================
            // Upload File to Supabase Storage
            // =====================================

            console.log(
                "⬆ Uploading file to Supabase Storage..."
            );

            const {
                error: storageError,
            } = await supabase.storage
                .from("documents")
                .upload(
                    storagePath,
                    fileBuffer,
                    {
                        contentType:
                            req.file.mimetype,
                        upsert: true,
                    }
                );

            if (storageError) {

                console.error(
                    "Storage Error:",
                    storageError
                );

                throw storageError;
            }

            console.log(
                "✅ Storage Upload Successful"
            );

            // =====================================
            // Get Public URL
            // =====================================

            const {
                data: {
                    publicUrl,
                },
            } = supabase.storage
                .from("documents")
                .getPublicUrl(
                    storagePath
                );

            // =====================================
            // Save Document Details
            // =====================================

            console.log(
                "💾 Saving document details..."
            );

            const {
                data,
                error,
            } = await supabase
                .from("documents")
                .insert([
                    {
                        user_id:
                            req.body.user_id,

                        file_name:
                            req.file.originalname,

                        file_type:
                            req.file.mimetype,

                        file_size:
                            req.file.size,

                        file_url:
                            publicUrl,

                        document_text:
                            extractedText,

                        content:
                            extractedText,
                    },
                ])
                .select()
                .single();

            if (error) {

                console.error(
                    "Document Database Error:",
                    error
                );

                throw error;
            }

            console.log(
                "✅ Document saved"
            );

            console.log(
                "Document ID:",
                data.id
            );

            // =====================================
            // CREATE RAG CHUNKS
            // =====================================

            console.log(
                "✂️ Creating document chunks..."
            );

            const chunks =
                chunkText(extractedText);

            console.log(
                `📦 Created ${chunks.length} chunks`
            );

            if (!chunks.length) {

                throw new Error(
                    "No document chunks were created."
                );

            }

            // =====================================
            // GENERATE EMBEDDINGS + SAVE CHUNKS
            // =====================================

            console.log(
                "🧠 Generating embeddings..."
            );

            let storedChunks = 0;

            for (const chunk of chunks) {

                console.log(
                    `Processing chunk ${chunk.chunk_index + 1}/${chunks.length}`
                );

                // -------------------------------
                // Generate embedding
                // -------------------------------

                const embedding =
                    await generateEmbedding(
                        chunk.content
                    );

                if (
                    !embedding ||
                    !Array.isArray(embedding)
                ) {

                    throw new Error(
                        `Embedding generation failed for chunk ${chunk.chunk_index}`
                    );

                }

                console.log(
                    `Embedding generated: ${embedding.length} dimensions`
                );

                // -------------------------------
                // Save chunk + embedding
                // -------------------------------

                const {
                    error: chunkError,
                } = await supabase
                    .from("document_chunks")
                    .insert({
                        document_id:
                            data.id,

                        chunk_index:
                            chunk.chunk_index,

                        content:
                            chunk.content,

                        embedding:
                            embedding,
                    });

                if (chunkError) {

                    console.error(
                        `❌ Chunk ${chunk.chunk_index} database error:`,
                        chunkError
                    );

                    throw chunkError;
                }

                storedChunks++;

                console.log(
                    `✅ Chunk ${chunk.chunk_index} stored`
                );
            }

            console.log(
                "===================================="
            );

            console.log(
                "🎉 RAG PROCESSING COMPLETED"
            );

            console.log(
                `📦 Total chunks: ${chunks.length}`
            );

            console.log(
                `🧠 Stored embeddings: ${storedChunks}`
            );

            console.log(
                "===================================="
            );

            // =====================================
            // Delete Local File
            // =====================================

            if (
                localFilePath &&
                fs.existsSync(localFilePath)
            ) {

                fs.unlinkSync(
                    localFilePath
                );

                console.log(
                    "🗑️ Local file deleted"
                );
            }

            // =====================================
            // Final Response
            // =====================================

            return res.json({

                success: true,

                message:
                    "Document uploaded and indexed successfully.",

                documentId:
                    data.id,

                fileName:
                    data.file_name,

                fileUrl:
                    publicUrl,

                chunks:
                    chunks.length,

                embeddings:
                    storedChunks,

            });

        } catch (err) {

            console.error(
                "===================================="
            );

            console.error(
                "❌ UPLOAD ERROR"
            );

            console.error(err);

            console.error(
                "===================================="
            );

            // =====================================
            // Cleanup Local File
            // =====================================

            if (
                localFilePath &&
                fs.existsSync(localFilePath)
            ) {

                try {

                    fs.unlinkSync(
                        localFilePath
                    );

                } catch (cleanupError) {

                    console.error(
                        "Cleanup Error:",
                        cleanupError
                    );

                }
            }

            return res.status(500).json({

                success: false,

                error:
                    err.message ||
                    "Document upload failed.",

            });

        }

    }
);

module.exports = router;