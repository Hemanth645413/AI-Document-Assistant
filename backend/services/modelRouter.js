function chooseModel(question) {

    const q = question.toLowerCase();

    if (
        q.includes("summary") ||
        q.includes("summarize")
    ) {
        return "gemini-flash";
    }

    return "groq-llama";
}

module.exports = chooseModel;