const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        console.log("====================================");
        console.log("Preview API Called");
        console.log("Requested Document ID:", id);
        console.log("====================================");

        const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        console.log("Supabase Data:", data);
        console.log("Supabase Error:", error);

        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }

        if (!data) {
            return res.status(404).json({
                success: false,
                error: "Document not found.",
            });
        }

        return res.json({
            success: true,
            document: data,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message,
        });

    }

});

module.exports = router;