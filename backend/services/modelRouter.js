
function chooseModel(
    selectedModel,
    task = "",
    documentText = ""
) {
    const userModel =
        (selectedModel || "").toLowerCase();

    const action =
        (task || "").toLowerCase();

    // =====================================
    // USER SELECTED MODEL
    // =====================================

    switch (userModel) {
        // -------------------------------
        // Gemini
        // -------------------------------

        case "gemini":
        case "gemini-flash":
        case "gemini-2.5-flash":
        case "gemini-2.5-pro":
        case "gemini-3-flash-preview":
            return "gemini-flash";

        // -------------------------------
        // Groq / Llama
        // -------------------------------

        case "groq":
        case "grok":
        case "groq-llama":
        case "llama":
            return "groq-llama";

        // -------------------------------
        // Hugging Face
        // -------------------------------

        case "huggingface":
        case "hugging-face":
            return "huggingface";

        // -------------------------------
        // DeepSeek
        // -------------------------------

        case "deepseek":
            return "groq-llama";

        default:
            break;
    }

    // =====================================
    // AUTOMATIC TASK ROUTING
    // =====================================

    // Summary
    if (
        action.includes("summary") ||
        action.includes("summarize")
    ) {
        return "gemini-flash";
    }

    // Diagram
    if (
        action.includes("diagram") ||
        action.includes("flowchart") ||
        action.includes("mermaid")
    ) {
        return "gemini-flash";
    }

    // Translation
    if (
        action.includes("translate") ||
        action.includes("translation")
    ) {
        return "gemini-flash";
    }

    // Image
    if (
        action.includes("image") ||
        action.includes("image generation")
    ) {
        return "gemini-flash";
    }

    // Interview
    if (
        action.includes("interview")
    ) {
        return "groq-llama";
    }

    // Video
    if (
        action.includes("video")
    ) {
        return "gemini-flash";
    }

    // =====================================
    // LARGE DOCUMENT
    // =====================================

    if (
        documentText.length > 15000
    ) {
        return "gemini-flash";
    }

    // =====================================
    // DEFAULT MODEL
    // =====================================

    return "groq-llama";
}

module.exports = chooseModel;