import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AakAssistant from "./pages/AakAssistant";

import Summary from "./pages/Summary";
import Diagram from "./pages/Diagram";
import Translate from "./pages/Translate";
import ImageGeneration from "./pages/ImageGeneration";
import VideoGeneration from "./pages/VideoGeneration";
import OCR from "./pages/OCR";
import QuestionAnswer from "./pages/QuestionAnswer";
import InterviewBot from "./pages/InterviewBot";
import ChatHistory from "./pages/Chathistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ======================================
                    AUTHENTICATION
                ====================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ======================================
                    DASHBOARD
                ====================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ======================================
                    AI DOCUMENT ASSISTANT
                ====================================== */}

        <Route
          path="/assistant"
          element={<AakAssistant />}
        />

        {/* ======================================
                    AI FEATURES
                ====================================== */}

        <Route
          path="/summary"
          element={<Summary />}
        />

        <Route
          path="/diagram"
          element={<Diagram />}
        />

        <Route
          path="/translate"
          element={<Translate />}
        />

        <Route
          path="/image-generation"
          element={<ImageGeneration />}
        />

        <Route
          path="/video-generation"
          element={<VideoGeneration />}
        />

        <Route
          path="/ocr"
          element={<OCR />}
        />

        <Route
          path="/question-answer"
          element={<QuestionAnswer />}
        />

        {/* ======================================
                    AI INTERVIEW BOT
                ====================================== */}

        <Route
          path="/interview"
          element={<InterviewBot />}
        />

        {/* ======================================
                    CHAT HISTORY
                ====================================== */}

        <Route
          path="/chat-history"
          element={<ChatHistory />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;