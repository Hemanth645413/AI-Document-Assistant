import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Divider,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    Psychology,
    PlayArrow,
    Send,
    Mic,
    Stop,
    RestartAlt,
} from "@mui/icons-material";
import axios from "axios";

interface Question {
    question: string;
    answer?: string;
    score?: number;
    feedback?: string;
    betterAnswer?: string;
}

const InterviewBot = () => {
    const [interviewType, setInterviewType] = useState("AI/ML");
    const [difficulty, setDifficulty] = useState("Intermediate");

    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentQuestion, setCurrentQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [feedback, setFeedback] = useState("");
    const [betterAnswer, setBetterAnswer] = useState("");
    const [score, setScore] = useState<number | null>(null);

    const [questionNumber, setQuestionNumber] = useState(1);
    const [totalQuestions] = useState(5);

    const [history, setHistory] = useState<Question[]>([]);

    const [isListening, setIsListening] = useState(false);

    // ==========================================
    // Start Interview
    // ==========================================

    const startInterview = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/chat/interview",
                {
                    action: "start",
                    interviewType,
                    difficulty,
                    questionNumber: 1,
                }
            );

            setStarted(true);
            setQuestionNumber(1);

            setCurrentQuestion(
                response.data.question ||
                "Tell me about yourself and your experience with AI and Machine Learning."
            );

            setAnswer("");
            setFeedback("");
            setBetterAnswer("");
            setScore(null);
            setHistory([]);

        } catch (error: any) {
            console.error("Interview start error:", error);

            // Temporary fallback question
            setStarted(true);
            setQuestionNumber(1);

            setCurrentQuestion(
                getFallbackQuestion(
                    interviewType,
                    difficulty,
                    1
                )
            );

            setAnswer("");
            setFeedback("");
            setBetterAnswer("");
            setScore(null);
            setHistory([]);

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Submit Answer
    // ==========================================

    const submitAnswer = async () => {
        if (!answer.trim()) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/chat/interview",
                {
                    action: "evaluate",
                    interviewType,
                    difficulty,
                    question: currentQuestion,
                    answer,
                    questionNumber,
                }
            );

            const evaluation = response.data;

            const newHistory: Question = {
                question: currentQuestion,
                answer,
                score: evaluation.score,
                feedback: evaluation.feedback,
                betterAnswer: evaluation.betterAnswer,
            };

            setHistory((previous) => [
                ...previous,
                newHistory,
            ]);

            setScore(
                typeof evaluation.score === "number"
                    ? evaluation.score
                    : null
            );

            setFeedback(
                evaluation.feedback ||
                "Good attempt. Keep improving your explanation."
            );

            setBetterAnswer(
                evaluation.betterAnswer ||
                "Try to provide a clear, structured answer with a practical example."
            );

        } catch (error: any) {
            console.error("Answer evaluation error:", error);

            // Fallback evaluation
            const fallbackScore = calculateFallbackScore(answer);

            setScore(fallbackScore);

            setFeedback(
                "Your answer shows an understanding of the topic. Try to explain the concept more clearly and include a real-world example."
            );

            setBetterAnswer(
                "A stronger answer should define the concept, explain how it works, and give a practical example."
            );

            const newHistory: Question = {
                question: currentQuestion,
                answer,
                score: fallbackScore,
                feedback:
                    "Your answer shows an understanding of the topic.",
                betterAnswer:
                    "Define the concept, explain how it works, and give a practical example.",
            };

            setHistory((previous) => [
                ...previous,
                newHistory,
            ]);

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Next Question
    // ==========================================

    const nextQuestion = async () => {
        const nextNumber = questionNumber + 1;

        if (nextNumber > totalQuestions) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/chat/interview",
                {
                    action: "next",
                    interviewType,
                    difficulty,
                    questionNumber: nextNumber,
                    previousQuestions: history,
                }
            );

            setQuestionNumber(nextNumber);

            setCurrentQuestion(
                response.data.question ||
                getFallbackQuestion(
                    interviewType,
                    difficulty,
                    nextNumber
                )
            );

            setAnswer("");
            setFeedback("");
            setBetterAnswer("");
            setScore(null);

        } catch (error) {
            console.error("Next question error:", error);

            setQuestionNumber(nextNumber);

            setCurrentQuestion(
                getFallbackQuestion(
                    interviewType,
                    difficulty,
                    nextNumber
                )
            );

            setAnswer("");
            setFeedback("");
            setBetterAnswer("");
            setScore(null);

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Speech Recognition
    // ==========================================

    const startSpeechRecognition = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                "Speech recognition is not supported in this browser."
            );
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript =
                event.results[0][0].transcript;

            setAnswer((previous) =>
                previous
                    ? `${previous} ${transcript}`
                    : transcript
            );
        };

        recognition.onerror = (event: any) => {
            console.error(
                "Speech recognition error:",
                event.error
            );

            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const stopSpeechRecognition = () => {
        setIsListening(false);
    };

    // ==========================================
    // Restart Interview
    // ==========================================

    const restartInterview = () => {
        setStarted(false);
        setCurrentQuestion("");
        setAnswer("");
        setFeedback("");
        setBetterAnswer("");
        setScore(null);
        setQuestionNumber(1);
        setHistory([]);
    };

    // ==========================================
    // Interview Completed
    // ==========================================

    const interviewCompleted =
        questionNumber >= totalQuestions &&
        score !== null;

    // ==========================================
    // UI
    // ==========================================

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                maxWidth: "1100px",
                margin: "0 auto",
            }}
        >
            {/* Header */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box
                    sx={{
                        width: 55,
                        height: 55,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "linear-gradient(135deg, #667eea, #764ba2)",
                    }}
                >
                    <Psychology
                        sx={{
                            color: "white",
                            fontSize: 32,
                        }}
                    />
                </Box>

                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        AI Interview Bot
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Practice interviews with an AI interviewer
                    </Typography>
                </Box>
            </Box>

            {/* Setup */}

            {!started && (
                <Card
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h5"
                            fontWeight={600}
                            mb={3}
                        >
                            Start Your Interview
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr",
                                },
                                gap: 3,
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel>
                                    Interview Type
                                </InputLabel>

                                <Select
                                    value={interviewType}
                                    label="Interview Type"
                                    onChange={(event) =>
                                        setInterviewType(
                                            event.target.value
                                        )
                                    }
                                >
                                    <MenuItem value="AI/ML">
                                        AI / Machine Learning
                                    </MenuItem>

                                    <MenuItem value="Generative AI">
                                        Generative AI
                                    </MenuItem>

                                    <MenuItem value="Python">
                                        Python
                                    </MenuItem>

                                    <MenuItem value="Backend">
                                        Backend Development
                                    </MenuItem>

                                    <MenuItem value="Technical">
                                        Technical Interview
                                    </MenuItem>

                                    <MenuItem value="HR">
                                        HR Interview
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>
                                    Difficulty
                                </InputLabel>

                                <Select
                                    value={difficulty}
                                    label="Difficulty"
                                    onChange={(event) =>
                                        setDifficulty(
                                            event.target.value
                                        )
                                    }
                                >
                                    <MenuItem value="Beginner">
                                        Beginner
                                    </MenuItem>

                                    <MenuItem value="Intermediate">
                                        Intermediate
                                    </MenuItem>

                                    <MenuItem value="Advanced">
                                        Advanced
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                            sx={{
                                mt: 4,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<PlayArrow />}
                                onClick={startInterview}
                                disabled={loading}
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "16px",
                                }}
                            >
                                {loading
                                    ? "Starting..."
                                    : "Start Interview"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Interview */}

            {started && (
                <>
                    {/* Progress */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Box>
                            <Chip
                                label={interviewType}
                                sx={{ mr: 1 }}
                            />

                            <Chip
                                label={difficulty}
                                variant="outlined"
                            />
                        </Box>

                        <Typography
                            fontWeight={600}
                            color="text.secondary"
                        >
                            Question {questionNumber} /{" "}
                            {totalQuestions}
                        </Typography>
                    </Box>

                    {/* Question */}

                    <Card
                        elevation={3}
                        sx={{
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Typography
                                variant="overline"
                                color="primary"
                                fontWeight={700}
                            >
                                AI INTERVIEWER
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{
                                    mt: 1,
                                    lineHeight: 1.5,
                                }}
                            >
                                {currentQuestion}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Answer */}

                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                mb={2}
                            >
                                Your Answer
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                minRows={7}
                                value={answer}
                                onChange={(event) =>
                                    setAnswer(
                                        event.target.value
                                    )
                                }
                                placeholder="Type your answer here..."
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mt: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button
                                    variant={
                                        isListening
                                            ? "outlined"
                                            : "outlined"
                                    }
                                    startIcon={
                                        isListening ? (
                                            <Stop />
                                        ) : (
                                            <Mic />
                                        )
                                    }
                                    onClick={
                                        isListening
                                            ? stopSpeechRecognition
                                            : startSpeechRecognition
                                    }
                                    sx={{
                                        textTransform: "none",
                                    }}
                                >
                                    {isListening
                                        ? "Listening..."
                                        : "Answer by Voice"}
                                </Button>

                                <Button
                                    variant="contained"
                                    startIcon={
                                        loading ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        ) : (
                                            <Send />
                                        )
                                    }
                                    onClick={submitAnswer}
                                    disabled={
                                        loading ||
                                        !answer.trim()
                                    }
                                    sx={{
                                        textTransform: "none",
                                    }}
                                >
                                    {loading
                                        ? "Evaluating..."
                                        : "Submit Answer"}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Evaluation */}

                    {score !== null && (
                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                mb: 3,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    mb={3}
                                >
                                    AI Evaluation
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        fontWeight={700}
                                        color={
                                            score >= 7
                                                ? "success.main"
                                                : score >= 5
                                                    ? "warning.main"
                                                    : "error.main"
                                        }
                                    >
                                        {score}/10
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Interview Score
                                    </Typography>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    mb={1}
                                >
                                    Feedback
                                </Typography>

                                <Alert
                                    severity={
                                        score >= 7
                                            ? "success"
                                            : score >= 5
                                                ? "warning"
                                                : "info"
                                    }
                                    sx={{ mb: 3 }}
                                >
                                    {feedback}
                                </Alert>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    mb={1}
                                >
                                    Better Answer
                                </Typography>

                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor:
                                            "action.hover",
                                    }}
                                >
                                    <Typography>
                                        {betterAnswer}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "center",
                                        gap: 2,
                                        mt: 4,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {questionNumber <
                                        totalQuestions ? (
                                        <Button
                                            variant="contained"
                                            onClick={
                                                nextQuestion
                                            }
                                            disabled={loading}
                                            sx={{
                                                textTransform:
                                                    "none",
                                            }}
                                        >
                                            Next Question
                                        </Button>
                                    ) : (
                                        <Alert severity="success">
                                            Interview completed!
                                        </Alert>
                                    )}

                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            <RestartAlt />
                                        }
                                        onClick={
                                            restartInterview
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                        }}
                                    >
                                        Restart Interview
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* Interview Summary */}

            {interviewCompleted && (
                <Card
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        mb: 3,
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            mb={3}
                        >
                            Interview Summary
                        </Typography>

                        <Typography
                            color="text.secondary"
                            mb={2}
                        >
                            You completed all{" "}
                            {totalQuestions} interview questions.
                        </Typography>

                        <Typography>
                            Questions answered:{" "}
                            <strong>
                                {history.length}
                            </strong>
                        </Typography>

                        <Typography>
                            Last score:{" "}
                            <strong>
                                {score}/10
                            </strong>
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

// ==========================================
// Fallback Questions
// ==========================================

function getFallbackQuestion(
    type: string,
    difficulty: string,
    number: number
): string {
    const questions: Record<string, string[]> = {
        "AI/ML": [
            "What is the difference between Machine Learning and Deep Learning?",
            "Explain the difference between supervised and unsupervised learning.",
            "What is overfitting and how can you prevent it?",
            "Explain how a Retrieval-Augmented Generation (RAG) system works.",
            "What is an embedding and why is it used in RAG?",
        ],

        "Generative AI": [
            "What is Generative AI?",
            "What is an LLM and how does it generate text?",
            "What is prompt engineering?",
            "Explain Retrieval-Augmented Generation (RAG).",
            "What is the difference between RAG and fine-tuning?",
        ],

        Python: [
            "What are the main features of Python?",
            "What is the difference between a list and a tuple?",
            "Explain Python dictionaries.",
            "What are decorators in Python?",
            "Explain exception handling in Python.",
        ],

        Backend: [
            "What is a REST API?",
            "What is the difference between GET and POST?",
            "Explain middleware in Node.js.",
            "How does authentication work in a backend application?",
            "How would you design a scalable backend API?",
        ],

        Technical: [
            "Tell me about your most recent technical project.",
            "Explain the architecture of your application.",
            "How do you handle errors in your application?",
            "How do you test your APIs?",
            "How would you improve the performance of your application?",
        ],

        HR: [
            "Tell me about yourself.",
            "Why are you interested in this position?",
            "What are your strengths?",
            "Tell me about a challenging project you worked on.",
            "Where do you see yourself in the next five years?",
        ],
    };

    const list =
        questions[type] || questions["AI/ML"];

    return (
        list[(number - 1) % list.length] ||
        `Question ${number}: Please explain your experience with ${type}.`
    );
}

// ==========================================
// Simple fallback score
// ==========================================

function calculateFallbackScore(
    answer: string
): number {
    const words = answer
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length < 10) {
        return 4;
    }

    if (words.length < 30) {
        return 6;
    }

    if (words.length < 60) {
        return 8;
    }

    return 9;
}

export default InterviewBot;