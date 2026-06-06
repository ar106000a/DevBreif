import { useState, useRef, useEffect } from "react";
import type { Brief, ChatMessage } from "../../pages/App";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import api from "../../lib/api";
import axios from "axios";

type InputStage = "input" | "chat" | "generating";

interface BriefInputProps {
  loading: boolean;
  setLoading: (val: boolean) => void;
  onGenerated: (brief: Brief) => void;
}

const EXAMPLES = [
  "A project management tool for freelancers to track clients, invoices, and deadlines in one place.",
  "A SaaS app where restaurants can manage their menu, orders, and staff shifts from one dashboard.",
  "A habit tracking app where users set daily goals, log progress, and get weekly AI-powered insights.",
];

const SAFETY_CAP = 5; // max user replies after initial idea

export default function BriefInput({
  setLoading,
  onGenerated,
}: BriefInputProps) {
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [stage, setStage] = useState<InputStage>("input");
  const [idea, setIdea] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [charWarning, setCharWarning] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const MAX = 500;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiThinking]);

  const addMessage = (role: "user" | "ai", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleChange = (val: string) => {
    if (val.length > MAX) {
      setCharWarning(true);
      return;
    }
    setCharWarning(false);
    setIdea(val);
    setError(null);
  };

  // ─── Step 1: Submit idea → confirm ────────────────────────────
  const handleSubmitIdea = async () => {
    if (!idea.trim()) {
      setError("Please describe your idea first.");
      return;
    }
    if (idea.trim().split(" ").length < 5) {
      setError("Give a bit more detail — at least a sentence.");
      return;
    }

    const trimmedIdea = idea.trim();
    setError(null);
    setAiThinking(true);
    setMessages([{ role: "user", content: trimmedIdea }]);
    setStage("chat");

    try {
      const res = await api.post("/app/brief/confirm", { idea: trimmedIdea });
      const data = res.data;

      if (!data.valid) {
        setStage("input");
        setMessages([]);
        setError(data.refusal);
        return;
      }

      addMessage("ai", data.understanding);

      if (data.needs_followup) {
        setPendingQuestion(data.followup_question);
      }
      // showQuickConfirm will be true now regardless — messages.length === 2
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      setStage("input");
      setMessages([]);
      setError(message);
    } finally {
      setAiThinking(false);
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  };

  // ─── Step 2: Send to followup (typed or quick confirm) ────────

  // ─── Step 3: Generate brief ───────────────────────────────────
  const generateBrief = async (summary: string, chatHistory: ChatMessage[]) => {
    setStage("generating");
    setLoading(true);

    try {
      const res = await api.post("/app/brief/generate", { idea: summary });
      const parsed = res.data.brief;

      const brief: Brief = {
        id: crypto.randomUUID(),
        title: parsed.title,
        idea: idea.trim(),
        description: parsed.description,
        features: parsed.features,
        stack: parsed.stack,
        timeline: parsed.timeline,
        cost: parsed.cost,
        team: parsed.team,
        questions: parsed.questions,
        risks: parsed.risks,
        is_public: false,
        created_at: new Date().toISOString(),
        chat_history: chatHistory,
      };

      onGenerated(brief);
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to generate brief. Please try again.";
      setError(message);
      setStage("chat");
    } finally {
      setLoading(false);
    }
  };
  // Quick confirm — always goes straight to followup API with affirmative
  const handleQuickConfirm = async () => {
    if (aiThinking) return;
    setPendingQuestion(null); // discard any pending question
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: "Yes, that's right." },
    ];
    setMessages(updatedMessages);
    setAiThinking(true);

    try {
      const res = await api.post("/app/brief/followup", {
        idea: idea.trim(),
        conversation: updatedMessages,
      });
      const data = res.data;

      if (data.ready) {
        const aiMsg = "Got everything I need — generating your brief now...";
        const finalHistory: ChatMessage[] = [
          ...updatedMessages,
          { role: "ai", content: aiMsg },
        ];
        setMessages(finalHistory);
        setAiThinking(false);
        await generateBrief(data.summary, finalHistory);
      } else {
        addMessage(
          "ai",
          data.followup_question ?? "Can you tell me a bit more?",
        );
        setAiThinking(false);
        setTimeout(() => chatInputRef.current?.focus(), 100);
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      addMessage("ai", message);
      setAiThinking(false);
    }
  };

  // Chat input submit — flush pending question first, then hit API
  const sendToFollowup = async (
    answer: string,
    currentMessages: ChatMessage[],
  ) => {
    const updatedMessages: ChatMessage[] = [
      ...currentMessages,
      { role: "user", content: answer },
    ];

    // If AI had a pending question, show it now — no API call yet
    if (pendingQuestion) {
      const question = pendingQuestion;
      setPendingQuestion(null);
      setMessages([...updatedMessages, { role: "ai", content: question }]);
      setTimeout(() => chatInputRef.current?.focus(), 100);
      return;
    }

    setMessages(updatedMessages);
    setAiThinking(true);

    const userReplies =
      updatedMessages.filter((m) => m.role === "user").length - 1;
    if (userReplies >= SAFETY_CAP) {
      const aiMsg = "Got everything I need — generating your brief now...";
      const finalHistory: ChatMessage[] = [
        ...updatedMessages,
        { role: "ai", content: aiMsg },
      ];
      setMessages(finalHistory);
      setAiThinking(false);
      await generateBrief(idea.trim(), finalHistory);
      return;
    }

    try {
      const res = await api.post("/app/brief/followup", {
        idea: idea.trim(),
        conversation: updatedMessages,
      });
      const data = res.data;

      if (data.ready) {
        const aiMsg = "Got everything I need — generating your brief now...";
        const finalHistory: ChatMessage[] = [
          ...updatedMessages,
          { role: "ai", content: aiMsg },
        ];
        setMessages(finalHistory);
        setAiThinking(false);
        await generateBrief(data.summary, finalHistory);
      } else {
        addMessage(
          "ai",
          data.followup_question ?? "Can you tell me a bit more?",
        );
        setAiThinking(false);
        setTimeout(() => chatInputRef.current?.focus(), 100);
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      addMessage("ai", message);
      setAiThinking(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || aiThinking) return;
    const answer = chatInput.trim();
    setChatInput("");
    await sendToFollowup(answer, messages);
  };

  const handleReset = () => {
    setStage("input");
    setMessages([]);
    setChatInput("");
    setError(null);
    setIdea("");
    setAiThinking(false);
    setPendingQuestion(null);
  };

  // Quick confirm shows only right after the AI's first understanding message
  // i.e. user sent idea, AI replied with understanding — no followup question yet
  const showQuickConfirm =
    !aiThinking &&
    messages.length === 2 &&
    messages[0].role === "user" &&
    messages[1].role === "ai";

  // ─── Input stage ──────────────────────────────────────────────
  if (stage === "input") {
    return (
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 0.5rem",
              color: "#ffffff",
            }}
          >
            What are you building?
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              color: "#ffffff40",
              fontWeight: 300,
              margin: 0,
            }}
          >
            Describe your idea in plain English. No technical knowledge needed.
          </p>
        </div>

        <div style={{ position: "relative", marginBottom: "0.75rem" }}>
          <textarea
            value={idea}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                handleSubmitIdea();
            }}
            placeholder="e.g. A project management tool for freelancers to track clients, invoices, and deadlines in one place..."
            rows={6}
            disabled={aiThinking}
            style={{
              width: "100%",
              background: "#111111",
              border: `1px solid ${error ? "#ff5f5650" : charWarning ? "#EF9F2750" : "#ffffff15"}`,
              borderRadius: "12px",
              padding: "1.1rem 1.25rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              color: "#ffffff",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.65,
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
              minHeight: "140px",
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = "#CBFF5E40";
            }}
            onBlur={(e) => {
              if (!error) e.currentTarget.style.borderColor = "#ffffff15";
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "0.75rem",
              right: "1rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: charWarning ? "#EF9F27" : "#ffffff20",
              transition: "color 0.2s",
            }}
          >
            {idea.length}/{MAX}
          </div>
        </div>

        {error && (
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem",
              color: "#ff5f56",
              marginBottom: "0.75rem",
              paddingLeft: "2px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          <Button
            size="lg"
            variant="primary"
            onClick={handleSubmitIdea}
            disabled={aiThinking}
          >
            Continue →
          </Button>
        </div>

        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#ffffff25",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            Try an example
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setIdea(ex);
                  setError(null);
                }}
                disabled={aiThinking}
                style={{
                  background: "transparent",
                  border: "1px solid #ffffff0f",
                  borderRadius: "8px",
                  padding: "0.65rem 1rem",
                  textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  color: "#ffffff40",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  lineHeight: 1.5,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#CBFF5E30";
                  e.currentTarget.style.color = "#ffffff70";
                  e.currentTarget.style.background = "#CBFF5E08";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ffffff0f";
                  e.currentTarget.style.color = "#ffffff40";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ color: "#CBFF5E50", marginRight: "0.5rem" }}>
                  →
                </span>
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Generating stage ─────────────────────────────────────────
  if (stage === "generating") {
    return (
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          gap: "1rem",
        }}
      >
        <Loader label="Building your brief..." />
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            color: "#ffffff25",
            margin: 0,
          }}
        >
          This takes about 10 seconds
        </p>
      </div>
    );
  }

  // ─── Chat stage ───────────────────────────────────────────────
  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 220px)",
        maxHeight: "580px",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            color: "#ffffff25",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Scoping your idea
        </div>
        <button
          onClick={handleReset}
          style={{
            background: "transparent",
            border: "none",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#ffffff25",
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff60")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff25")}
        >
          ← Start over
        </button>
      </div>

      {/* Messages thread */}
      <div
        className="chat-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          paddingRight: "0.25rem",
          scrollbarWidth: "thin",
          scrollbarColor: "#ffffff15 transparent",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "0.75rem 1rem",
                borderRadius:
                  msg.role === "user"
                    ? "12px 12px 2px 12px"
                    : "12px 12px 12px 2px",
                background: msg.role === "user" ? "#CBFF5E12" : "#111111",
                border:
                  msg.role === "user"
                    ? "1px solid #CBFF5E20"
                    : "1px solid #ffffff0f",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                color: msg.role === "user" ? "#CBFF5Ecc" : "#ffffff80",
                lineHeight: 1.65,
                fontWeight: 300,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {aiThinking && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "12px 12px 12px 2px",
                background: "#111111",
                border: "1px solid #ffffff0f",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#ffffff30",
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick confirm — only shown right after AI understanding, before any followup */}
      {showQuickConfirm && (
        <div style={{ marginTop: "0.75rem", flexShrink: 0 }}>
          <button
            onClick={handleQuickConfirm}
            style={{
              background: "#CBFF5E",
              color: "#080808",
              border: "none",
              borderRadius: "8px",
              padding: "0.55rem 1.1rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Looks right, generate brief →
          </button>
        </div>
      )}

      {/* Chat input — always visible in chat stage */}
      <div
        style={{ marginTop: "0.75rem", position: "relative", flexShrink: 0 }}
      >
        <textarea
          ref={chatInputRef}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleChatSubmit();
            }
          }}
          placeholder={
            showQuickConfirm
              ? "Or type a correction..."
              : "Type your answer... (Enter to send, Shift+Enter for new line)"
          }
          rows={2}
          disabled={aiThinking}
          style={{
            width: "100%",
            background: "#111111",
            border: "1px solid #ffffff15",
            borderRadius: "10px",
            padding: "0.85rem 3.5rem 0.85rem 1rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            color: "#ffffff",
            resize: "none",
            outline: "none",
            lineHeight: 1.5,
            boxSizing: "border-box",
            transition: "border-color 0.2s",
            opacity: aiThinking ? 0.5 : 1,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#CBFF5E40")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#ffffff15")}
        />
        <button
          onClick={handleChatSubmit}
          disabled={aiThinking || !chatInput.trim()}
          style={{
            position: "absolute",
            right: "0.6rem",
            bottom: "0.6rem",
            background: chatInput.trim() ? "#CBFF5E" : "#ffffff10",
            border: "none",
            borderRadius: "6px",
            padding: "0.4rem 0.65rem",
            cursor: chatInput.trim() ? "pointer" : "default",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 12V2M2 7l5-5 5 5"
              stroke={chatInput.trim() ? "#080808" : "#ffffff30"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
