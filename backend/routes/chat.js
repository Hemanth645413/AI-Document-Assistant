const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const { Client: MagicHourClient } = require("magic-hour");

const litellm = require("../config/litellm");
const supabase = require("../config/supabase");
const chooseModel = require("../services/modelRouter");

const router = express.Router();

// =====================================
// Magic Hour Client
// =====================================

const magicHourClient = new MagicHourClient({
    token: process.env.MAGIC_HOUR_API_KEY,
});

// =====================================
// Video Storage
// =====================================

const videoDirectory = path.join(
    __dirname,
    "../generated-videos"
);

if (!fs.existsSync(videoDirectory)) {
    fs.mkdirSync(videoDirectory, {
        recursive: true,
    });
}

// =====================================
// Multer Configuration
// =====================================

const upload = multer({
    dest: path.join(__dirname, "../uploads"),
});

// =====================================
// LiteLLM Helper
// =====================================

async function callLiteLLM(
    model,
    messages,
    options = {}
) {
    try {
        const response = await litellm.post(
            "/v1/chat/completions",
            {
                model,
                messages,
                temperature:
                    options.temperature ?? 0.7,
                max_tokens:
                    options.max_tokens ?? 2000,
            }
        );

        return (
            response.data?.choices?.[0]
                ?.message?.content || ""
        );
    } catch (error) {
        console.error(
            "LiteLLM Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
}

// =====================================
// CHAT API
// =====================================

router.post("/", async (req, res) => {
    try {
        const {
            message,
            question,
            documentId,
            model,
        } = req.body;

        const userMessage =
            message || question;

        if (!userMessage) {
            return res.status(400).json({
                success: false,
                error: "Message or question is required.",
            });
        }

        console.log(
            "💬 Chat request:",
            userMessage
        );

        // =====================================
        // Select Model
        // =====================================

        const selectedModel =
            chooseModel({
                model,
                question: userMessage,
            });

        console.log(
            "🤖 Selected model:",
            selectedModel
        );

        // =====================================
        // RAG Context
        // =====================================

        let context = "";

        if (documentId) {
            try {
                const {
                    data: chunks,
                    error,
                } = await supabase
                    .from("document_chunks")
                    .select("content")
                    .eq(
                        "document_id",
                        documentId
                    )
                    .order("chunk_index", {
                        ascending: true,
                    });

                if (error) {
                    console.error(
                        "❌ RAG fetch error:",
                        error
                    );
                } else if (
                    chunks &&
                    chunks.length > 0
                ) {
                    context = chunks
                        .map(
                            (chunk) =>
                                chunk.content
                        )
                        .join("\n\n");

                    console.log(
                        `📚 RAG context loaded: ${chunks.length} chunks`
                    );
                }
            } catch (ragError) {
                console.error(
                    "❌ RAG error:",
                    ragError
                );
            }
        }

        // =====================================
        // Build Messages
        // =====================================

        const messages = [];

        if (context) {
            messages.push({
                role: "system",
                content: `
You are an AI Document Assistant.

Answer the user's question using the document context below.

If the answer is available in the document,
use the document information.

If the answer is not available,
clearly say that the information is not available
in the uploaded document.

DOCUMENT CONTEXT:

${context}
                `,
            });
        } else {
            messages.push({
                role: "system",
                content:
                    "You are a helpful AI assistant.",
            });
        }

        messages.push({
            role: "user",
            content: userMessage,
        });

        // =====================================
        // Generate Answer
        // =====================================

        const answer =
            await callLiteLLM(
                selectedModel,
                messages
            );

        console.log(
            "✅ Chat response generated"
        );

        // =====================================
        // Save Chat History
        // =====================================

        try {
            await supabase
                .from("chat_history")
                .insert({
                    question: userMessage,
                    answer,
                    model: selectedModel,
                    document_id:
                        documentId || null,
                });
        } catch (historyError) {
            console.error(
                "⚠️ Chat history save failed:",
                historyError
            );
        }

        return res.json({
            success: true,
            model: selectedModel,
            answer,
        });
    } catch (error) {
        console.error(
            "❌ Chat API Error:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            error:
                error.response?.data ||
                error.message ||
                "Chat generation failed.",
        });
    }
});


// =====================================
// SUMMARY API
// =====================================

router.post("/summary", async (req, res) => {
    try {
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Document ID is required.",
            });
        }

        console.log(
            "📝 Summary request for:",
            documentId
        );

        // =====================================
        // Get Document Chunks
        // =====================================

        const {
            data: chunks,
            error,
        } = await supabase
            .from("document_chunks")
            .select("content")
            .eq("document_id", documentId)
            .order("chunk_index", {
                ascending: true,
            });

        if (error) {
            console.error(
                "❌ Summary document fetch error:",
                error
            );

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }

        if (!chunks || chunks.length === 0) {
            return res.status(404).json({
                success: false,
                error:
                    "No document content found.",
            });
        }

        const documentText = chunks
            .map((chunk) => chunk.content)
            .join("\n\n");

        // =====================================
        // Select Summary Model
        // =====================================

        const selectedModel =
            chooseModel({
                task: "summary",
            });

        console.log(
            "🤖 Summary model:",
            selectedModel
        );

        // =====================================
        // Generate Summary
        // =====================================

        const summary =
            await callLiteLLM(
                selectedModel,
                [
                    {
                        role: "system",
                        content:
                            "You are an expert document summarization assistant. Create a clear, accurate and well-structured summary of the provided document.",
                    },
                    {
                        role: "user",
                        content: `
Summarize the following document.

Provide:
1. Main topic
2. Key points
3. Important information
4. Short conclusion

DOCUMENT:

${documentText}
                        `,
                    },
                ],
                {
                    temperature: 0.3,
                    max_tokens: 3000,
                }
            );

        console.log(
            "✅ Summary generated"
        );

        return res.json({
            success: true,
            model: selectedModel,
            summary,
        });
    } catch (error) {
        console.error(
            "❌ Summary API Error:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            error:
                error.response?.data ||
                error.message ||
                "Summary generation failed.",
        });
    }
});

// =====================================
// TRANSLATION API
// =====================================

router.post("/translate", async (req, res) => {
    try {
        const {
            text,
            targetLanguage,
        } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: "Text is required.",
            });
        }

        if (!targetLanguage) {
            return res.status(400).json({
                success: false,
                error:
                    "Target language is required.",
            });
        }

        console.log(
            "🌐 Translation request:",
            targetLanguage
        );

        // =====================================
        // Select Translation Model
        // =====================================

        const selectedModel =
            chooseModel({
                task: "translation",
            });

        console.log(
            "🤖 Translation model:",
            selectedModel
        );

        // =====================================
        // Translate
        // =====================================

        const translation =
            await callLiteLLM(
                selectedModel,
                [
                    {
                        role: "system",
                        content:
                            "You are a professional translation assistant. Translate the provided text accurately while preserving its meaning and formatting.",
                    },
                    {
                        role: "user",
                        content: `
Translate the following text into ${targetLanguage}.

TEXT:

${text}
                        `,
                    },
                ],
                {
                    temperature: 0.2,
                    max_tokens: 3000,
                }
            );

        console.log(
            "✅ Translation generated"
        );

        return res.json({
            success: true,
            model: selectedModel,
            targetLanguage,
            translation,
        });
    } catch (error) {
        console.error(
            "❌ Translation API Error:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            error:
                error.response?.data ||
                error.message ||
                "Translation failed.",
        });
    }
});
// =====================================
// SERVE GENERATED VIDEO FILE
// =====================================

router.get(
    "/video/:fileName",
    (req, res) => {
        try {
            const fileName =
                path.basename(
                    req.params.fileName
                );

            const filePath =
                path.join(
                    videoDirectory,
                    fileName
                );

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    error:
                        "Video file not found.",
                });
            }

            res.sendFile(
                filePath
            );
        } catch (error) {
            console.error(
                "❌ Video file error:",
                error
            );

            return res.status(500).json({
                success: false,
                error:
                    "Unable to serve video file.",
            });
        }
    }
);

// =====================================
// INTERVIEW BOT API
// =====================================

// Generate Interview Question
router.post(
    "/interview/question",
    async (req, res) => {
        try {
            const {
                interviewType,
                difficulty,
                questionNumber,
            } = req.body;

            const type =
                interviewType ||
                "Technical";

            const level =
                difficulty ||
                "Medium";

            const number =
                questionNumber || 1;

            const selectedModel =
                chooseModel({
                    task: "interview",
                });

            const question =
                await callLiteLLM(
                    selectedModel,
                    [
                        {
                            role: "system",
                            content: `
You are an expert technical interviewer.

Generate interview questions appropriate
for the requested interview type and difficulty.

Return ONLY the question.
Do not provide the answer.
                            `,
                        },
                        {
                            role: "user",
                            content: `
Interview Type:
${type}

Difficulty:
${level}

Question Number:
${number}

Generate one interview question.
                            `,
                        },
                    ],
                    {
                        temperature: 0.7,
                        max_tokens: 500,
                    }
                );

            return res.json({
                success: true,
                model: selectedModel,
                question:
                    question.trim(),
            });
        } catch (error) {
            console.error(
                "❌ Interview Question Error:",
                error.response?.data ||
                error.message
            );

            return res.status(500).json({
                success: false,
                error:
                    error.message ||
                    "Failed to generate interview question.",
            });
        }
    }
);

// =====================================
// INTERVIEW ANSWER EVALUATION
// =====================================

router.post(
    "/interview/evaluate",
    async (req, res) => {
        try {
            const {
                question,
                answer,
                interviewType,
                difficulty,
            } = req.body;

            if (!question || !answer) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Question and answer are required.",
                });
            }

            const selectedModel =
                chooseModel({
                    task: "interview",
                });

            const evaluation =
                await callLiteLLM(
                    selectedModel,
                    [
                        {
                            role: "system",
                            content: `
You are an expert interview evaluator.

Evaluate the candidate's answer fairly.

Return the response in this format:

SCORE: X/10

FEEDBACK:
...

STRENGTHS:
...

IMPROVEMENTS:
...

BETTER ANSWER:
...

Keep the feedback practical and interview-focused.
                            `,
                        },
                        {
                            role: "user",
                            content: `
Interview Type:
${interviewType ||
                                "Technical"
                                }

Difficulty:
${difficulty ||
                                "Medium"
                                }

QUESTION:
${question}

CANDIDATE ANSWER:
${answer}
                            `,
                        },
                    ],
                    {
                        temperature: 0.3,
                        max_tokens: 1500,
                    }
                );

            return res.json({
                success: true,
                model: selectedModel,
                evaluation:
                    evaluation.trim(),
            });
        } catch (error) {
            console.error(
                "❌ Interview Evaluation Error:",
                error.response?.data ||
                error.message
            );

            return res.status(500).json({
                success: false,
                error:
                    error.message ||
                    "Interview evaluation failed.",
            });
        }
    }
);

// =====================================
// MODULE EXPORT
// =====================================

module.exports = router;
// =====================================
// MAGIC HOUR VIDEO STATUS API
// =====================================

router.get("/video/status/:videoId", async (req, res) => {
    try {
        const { videoId } = req.params;

        if (!videoId) {
            return res.status(400).json({
                success: false,
                error: "Video ID is required."
            });
        }

        const response = await fetch(
            `https://api.magichour.ai/v1/video-projects/${videoId}`,
            {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "authorization": `Bearer ${process.env.MAGIC_HOUR_API_KEY}`
                }
            }
        );

        const data = await response.json();

        console.log("🎬 Magic Hour Status:", data);

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error:
                    data?.message ||
                    data?.error?.message ||
                    "Failed to check video status.",
                details: data
            });
        }

        let videoUrl = null;

        if (
            data.status === "complete" &&
            data.downloads &&
            data.downloads.length > 0
        ) {
            videoUrl = data.downloads[0].url;
        }

        return res.json({
            success: true,
            videoId,
            status: data.status,
            videoUrl,
            downloads: data.downloads || [],
            creditsCharged: data.credits_charged || null
        });

    } catch (error) {
        console.error("❌ Video Status Error:", error);

        return res.status(500).json({
            success: false,
            error: error.message || "Failed to check video status."
        });
    }
});
// =====================================
// MAGIC HOUR TEXT-TO-VIDEO API
// =====================================

router.post("/video", upload.single("image"), async (req, res) => {
    try {
        const {
            prompt,
            aspectRatio = "16:9",
            resolution = "480p",
            duration = 3
        } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                error: "Video prompt is required."
            });
        }

        if (!process.env.MAGIC_HOUR_API_KEY) {
            return res.status(500).json({
                success: false,
                error: "MAGIC_HOUR_API_KEY is not configured."
            });
        }

        console.log("🎬 Starting Magic Hour video generation...");
        console.log("Prompt:", prompt);
        console.log("Aspect Ratio:", aspectRatio);
        console.log("Resolution:", resolution);
        console.log("Duration:", duration);

        // -------------------------------------
        // Create Magic Hour video job
        // -------------------------------------

        const response = await fetch(
            "https://api.magichour.ai/v1/text-to-video",
            {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "authorization": `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: `AI Document Assistant Video ${Date.now()}`,
                    end_seconds: Number(duration),
                    aspect_ratio: aspectRatio,
                    resolution: resolution,
                    model: "wan-2.2",
                    style: {
                        prompt: prompt.trim()
                    }
                })
            }
        );

        const data = await response.json();

        console.log("Magic Hour response:", data);

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error:
                    data?.message ||
                    data?.error?.message ||
                    "Magic Hour video generation failed.",
                details: data
            });
        }

        if (!data.id) {
            return res.status(500).json({
                success: false,
                error: "Magic Hour did not return a video ID.",
                details: data
            });
        }

        console.log("✅ Magic Hour job created");
        console.log("Video ID:", data.id);

        // -------------------------------------
        // Return job ID immediately
        // -------------------------------------

        return res.json({
            success: true,
            message: "Video generation started.",
            videoId: data.id,
            status: "queued",
            creditsCharged: data.credits_charged || null
        });

    } catch (error) {
        console.error("❌ Magic Hour Video Error:", error);

        return res.status(500).json({
            success: false,
            error: error.message || "Video generation failed."
        });
    }
});
// =====================================
// MAGIC HOUR IMAGE-TO-VIDEO API
// =====================================

router.post(
    "/image-to-video",
    upload.single("image"),
    async (req, res) => {
        try {
            const {
                prompt = "Create natural cinematic motion from this image.",
                resolution = "480p",
                duration = 3,
            } = req.body;

            // -------------------------------------
            // Check image
            // -------------------------------------

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "Please upload an image."
                });
            }

            // -------------------------------------
            // Check API key
            // -------------------------------------

            if (!process.env.MAGIC_HOUR_API_KEY) {
                return res.status(500).json({
                    success: false,
                    error:
                        "MAGIC_HOUR_API_KEY is not configured."
                });
            }

            console.log(
                "🖼️ Starting Magic Hour Image-to-Video..."
            );

            console.log(
                "Image:",
                req.file.originalname
            );

            console.log(
                "Prompt:",
                prompt
            );

            console.log(
                "Resolution:",
                resolution
            );

            console.log(
                "Duration:",
                duration
            );

            // -------------------------------------
            // 1. Get Magic Hour upload URL
            // -------------------------------------

            const extension =
                path.extname(
                    req.file.originalname
                )
                    .replace(".", "")
                    .toLowerCase() || "jpg";

            const uploadUrlResponse =
                await fetch(
                    "https://api.magichour.ai/v1/files/upload-urls",
                    {
                        method: "POST",
                        headers: {
                            accept:
                                "application/json",
                            authorization:
                                `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
                            "content-type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            items: [
                                {
                                    type: "image",
                                    extension
                                }
                            ]
                        })
                    }
                );

            const uploadData =
                await uploadUrlResponse.json();

            console.log(
                "Magic Hour Upload URL Response:",
                uploadData
            );

            if (!uploadUrlResponse.ok) {
                return res.status(
                    uploadUrlResponse.status
                ).json({
                    success: false,
                    error:
                        uploadData?.message ||
                        uploadData?.error?.message ||
                        "Failed to create image upload URL.",
                    details: uploadData
                });
            }

            const uploadItem =
                uploadData?.items?.[0];

            if (
                !uploadItem?.upload_url ||
                !uploadItem?.file_path
            ) {
                return res.status(500).json({
                    success: false,
                    error:
                        "Magic Hour did not return an upload URL."
                });
            }

            // -------------------------------------
            // 2. Upload image to Magic Hour
            // -------------------------------------

            const imageBuffer =
                fs.readFileSync(
                    req.file.path
                );

            const imageUploadResponse =
                await fetch(
                    uploadItem.upload_url,
                    {
                        method: "PUT",
                        headers: {
                            "content-type":
                                req.file.mimetype ||
                                "application/octet-stream"
                        },
                        body: imageBuffer
                    }
                );

            if (!imageUploadResponse.ok) {
                const uploadError =
                    await imageUploadResponse.text();

                console.error(
                    "❌ Magic Hour image upload failed:",
                    uploadError
                );

                return res.status(500).json({
                    success: false,
                    error:
                        "Failed to upload image to Magic Hour.",
                    details: uploadError
                });
            }

            console.log(
                "✅ Image uploaded to Magic Hour"
            );

            console.log(
                "Magic Hour file path:",
                uploadItem.file_path
            );

            // -------------------------------------
            // 3. Create Image-to-Video job
            // -------------------------------------

            const videoResponse =
                await fetch(
                    "https://api.magichour.ai/v1/image-to-video",
                    {
                        method: "POST",
                        headers: {
                            accept:
                                "application/json",
                            authorization:
                                `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
                            "content-type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            name:
                                `AI Image Video ${Date.now()}`,

                            end_seconds:
                                Number(duration),

                            model:
                                "wan-2.2",

                            resolution:
                                resolution,

                            assets: {
                                image_file_path:
                                    uploadItem.file_path
                            },

                            style: {
                                prompt:
                                    prompt.trim()
                            }
                        })
                    }
                );

            const videoData =
                await videoResponse.json();

            console.log(
                "Magic Hour Image-to-Video Response:",
                videoData
            );

            if (!videoResponse.ok) {
                return res.status(
                    videoResponse.status
                ).json({
                    success: false,
                    error:
                        videoData?.message ||
                        videoData?.error?.message ||
                        "Image-to-Video generation failed.",
                    details: videoData
                });
            }

            if (!videoData?.id) {
                return res.status(500).json({
                    success: false,
                    error:
                        "Magic Hour did not return a video ID.",
                    details: videoData
                });
            }

            console.log(
                "✅ Image-to-Video job created"
            );

            console.log(
                "🎬 Video ID:",
                videoData.id
            );

            // -------------------------------------
            // 4. Delete temporary local image
            // -------------------------------------

            try {
                fs.unlinkSync(
                    req.file.path
                );
            } catch (deleteError) {
                console.log(
                    "⚠️ Could not delete temporary image:",
                    deleteError.message
                );
            }

            // -------------------------------------
            // 5. Return video job
            // -------------------------------------

            return res.json({
                success: true,
                message:
                    "Image-to-Video generation started.",
                videoId:
                    videoData.id,
                status: "queued",
                creditsCharged:
                    videoData.credits_charged ||
                    null
            });

        } catch (error) {
            console.error(
                "❌ Image-to-Video Error:",
                error
            );

            // Clean temporary file
            if (req.file?.path) {
                try {
                    if (
                        fs.existsSync(
                            req.file.path
                        )
                    ) {
                        fs.unlinkSync(
                            req.file.path
                        );
                    }
                } catch (cleanupError) {
                    console.error(
                        "Image cleanup error:",
                        cleanupError.message
                    );
                }
            }

            return res.status(500).json({
                success: false,
                error:
                    error.message ||
                    "Image-to-Video generation failed."
            });
        }
    }
);