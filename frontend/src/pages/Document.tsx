import { useState } from "react";
import { Box } from "@mui/material";

import Layout from "../components/Layout";

import DocumentToolbar from "../components/documents/DocumentToolbar";
import DocumentGrid from "../components/documents/DocumentGrid";
import EmptyState from "../components/documents/EmptyState";

export default function Document() {
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"grid" | "table">("grid");

    const documents: any[] = [];

    return (
        <Layout>
            <DocumentToolbar
                search={search}
                setSearch={setSearch}
                view={view}
                setView={setView}
            />

            <Box mt={3}>
                {documents.length === 0 ? (
                    <EmptyState />
                ) : (
                    <DocumentGrid documents={documents} />
                )}
            </Box>
        </Layout>
    );
}