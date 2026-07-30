import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import mermaid from "mermaid";
import Layout from "../components/Layout";

mermaid.initialize({
    startOnLoad: false,
    theme: "default",
});

function Diagram() {
    const location = useLocation();
    const diagram = location.state?.diagram || "";
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function renderDiagram() {
            if (!diagram || !containerRef.current) return;

            try {
                const id = "mermaid-diagram";
                const { svg } = await mermaid.render(id, diagram);
                containerRef.current.innerHTML = svg;
            } catch (error) {
                console.error("Mermaid render error:", error);
                if (containerRef.current) {
                    containerRef.current.innerHTML =
                        "<p>Failed to render diagram.</p>";
                }
            }
        }

        renderDiagram();
    }, [diagram]);

    return (
        <Layout>
            <h1>📊 AI Generated Diagram</h1>

            {diagram ? (
                <div
                    ref={containerRef}
                    style={{
                        background: "#ffffff",
                        padding: "20px",
                        borderRadius: "8px",
                        overflowX: "auto",
                    }}
                />
            ) : (
                <p>No diagram available. Generate one from the Assistant page.</p>
            )}
        </Layout>
    );
}

export default Diagram;
