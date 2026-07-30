import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/chat/history");
            setHistory(res.data.history);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Layout>
            <h1>📜 Chat History</h1>

            {history.length === 0 ? (
                <p>No conversations found.</p>
            ) : (
                history.map((item: any) => (
                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                        }}
                    >
                        <h3>Question</h3>
                        <p>{item.question}</p>

                        <h3>Answer</h3>
                        <p>{item.answer}</p>

                        <h4>Model Used</h4>
                        <p>{item.model_used}</p>
                    </div>
                ))
            )}
        </Layout>
    );
}

export default History;