const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// XLSX and PPTX support are optional — these packages are not part of the
// base install (`npm install xlsx pptx2json` to enable them). We require
// them lazily so a missing package only breaks those two file types
// instead of crashing the whole server on startup.
function loadOptional(moduleName) {
    try {
        return require(moduleName);
    } catch (err) {
        return null;
    }
}

async function extractText(filePath) {

    const extension =
        path.extname(filePath)
            .toLowerCase()
            .replace(".", "");

    try {

        /* =====================================
           PDF
        ===================================== */

        if (extension === "pdf") {

            const buffer =
                fs.readFileSync(filePath);

            const data =
                await pdfParse(buffer);

            return data.text;

        }

        /* =====================================
           WORD
        ===================================== */

        if (extension === "docx") {

            const result =
                await mammoth.extractRawText({
                    path: filePath,
                });

            return result.value;

        }

        /* =====================================
           EXCEL
        ===================================== */

        if (
            extension === "xlsx" ||
            extension === "xls"
        ) {

            const XLSX = loadOptional("xlsx");

            if (!XLSX) {
                throw new Error(
                    "Excel support requires the 'xlsx' package. Run: npm install xlsx"
                );
            }

            const workbook =
                XLSX.readFile(filePath);

            let text = "";

            workbook.SheetNames.forEach(sheet => {

                text += XLSX.utils.sheet_to_csv(
                    workbook.Sheets[sheet]
                );

                text += "\n";

            });

            return text;

        }

        /* =====================================
           POWERPOINT
        ===================================== */

        if (
            extension === "pptx"
        ) {

            const pptx2json = loadOptional("pptx2json");

            if (!pptx2json) {
                throw new Error(
                    "PowerPoint support requires the 'pptx2json' package. Run: npm install pptx2json"
                );
            }

            const slides =
                await pptx2json(filePath);

            let text = "";

            slides.forEach(slide => {

                slide.texts.forEach(item => {

                    text += item.text + "\n";

                });

            });

            return text;

        }

        /* =====================================
           IMAGE
        ===================================== */

        if (
            extension === "png" ||
            extension === "jpg" ||
            extension === "jpeg"
        ) {

            return "Image uploaded successfully. OCR integration is pending.";

        }

        throw new Error(
            "Unsupported file format."
        );

    }

    catch (error) {

        console.error(error);

        throw error;

    }

}

module.exports = extractText;