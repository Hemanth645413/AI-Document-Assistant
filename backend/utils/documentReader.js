const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(filePath) {
    const extension = filePath.split(".").pop().toLowerCase();

    try {
        // Read PDF
        if (extension === "pdf") {
            const buffer = fs.readFileSync(filePath);
            const data = await pdfParse(buffer);
            return data.text;
        }

        // Read DOCX
        if (extension === "docx") {
            const result = await mammoth.extractRawText({
                path: filePath,
            });

            return result.value;
        }

        throw new Error("Unsupported file format");
    } catch (error) {
        throw error;
    }
}

module.exports = extractText;