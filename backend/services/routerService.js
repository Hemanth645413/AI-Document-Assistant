// backend/src/services/routerService.js

const geminiService = require("./geminiService");
const grokService = require("./grokService");
const openaiService = require("./openaiService");
const huggingfaceService = require("./huggingfaceService");

async function routeRequest(model, prompt) {
    switch (model) {
        case "gemini-2.5-pro":
            return await geminiService.generate(prompt);

        case "grok":
            return await grokService.generate(prompt);

        case "gpt-5.5":
        case "gpt-4.1":
            return await openaiService.generate(model, prompt);

        case "huggingface":
            return await huggingfaceService.generate(prompt);

        default:
            throw new Error(`Unsupported AI model: ${model}`);
    }
}

module.exports = {
    routeRequest,
};