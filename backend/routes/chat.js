const express = require("express");
const litellm = require("../config/litellm");
const supabase = require("../config/supabase");
const chooseModel = require("../services/modelRouter");

const router = express.Router();

// AI Chat
router.post("/", async (req, res) => {
    try {
        const { documentId, message } = req.body;
        if (!documentId) return res.status(400).json({ success: false, error: "Document ID is required." });
        if (!message) return res.status(400).json({ success: false, error: "Question is required." });

        const { data: document, error } = await supabase.from("documents")
            .select("user_id,file_name,document_text")
            .eq("id", documentId).single();

        if (error || !document) return res.status(404).json({ success: false, error: "Document not found." });

        const model = chooseModel(message, document.document_text);

        const response = await litellm.post("/chat/completions", {
            model,
            messages: [{
                role: "user", content: `You are an AI Document Assistant.

Document Name:
${document.file_name}

Document Content:
${document.document_text}

User Question:
${message}

Answer ONLY using the uploaded document.`}],
            temperature: 0.3
        });

        const answer = response.data.choices[0].message.content;

        await supabase.from("chat_history").insert({
            user_id: document.user_id,
            document_id: documentId,
            question: message,
            answer,
            model_used: model
        });

        return res.json({ success: true, model, answer });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.response?.data || err.message });
    }
});

// Summary
router.post("/summary", async (req, res) => {
    try {
        const { documentId } = req.body;
        if (!documentId) return res.status(400).json({ success: false, error: "Document ID is required." });

        const { data: document, error } = await supabase.from("documents")
            .select("file_name,document_text")
            .eq("id", documentId).single();

        if (error || !document) return res.status(404).json({ success: false, error: "Document not found." });

        const model = chooseModel("summarize", document.document_text);

        const response = await litellm.post("/chat/completions", {
            model,
            messages: [{ role: "user", content: `Summarize this document:\n${document.document_text}` }],
            temperature: 0.3
        });

        return res.json({
            success: true,
            model,
            summary: response.data.choices[0].message.content
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.response?.data || err.message });
    }
});

// Diagram
router.post("/diagram", async (req, res) => {
    try {
        const { documentId } = req.body;
        if (!documentId) return res.status(400).json({ success: false, error: "Document ID is required." });

        const { data: document, error } = await supabase.from("documents")
            .select("file_name,document_text")
            .eq("id", documentId).single();

        if (error || !document) return res.status(404).json({ success: false, error: "Document not found." });

        const response = await litellm.post("/chat/completions", {
            model: "gemini-flash",
            messages: [{
                role: "user", content: `Generate ONLY a Mermaid flowchart from this document.
Return only Mermaid syntax.
Start with graph TD.

${document.document_text}`
            }],
            temperature: 0.2
        });

        let diagram = response.data.choices[0].message.content.trim();
        diagram = diagram.replace(/^```mermaid\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
        if (!diagram.startsWith("graph")) {
            diagram = "graph TD\nA[Diagram Generation Failed]";
        }

        return res.json({ success: true, diagram });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.response?.data || err.message });
    }
});

// History
router.get("/history", async (req, res) => {
    try {
        const { data, error } = await supabase.from("chat_history").select("*").order("created_at", { ascending: false });
        if (error) return res.status(400).json({ success: false, error: error.message });
        return res.json({ success: true, history: data });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
