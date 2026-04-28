/**
 * Floating AI chatbot widget.
 * Sends messages to /api/chatbot and displays responses.
 */
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/api";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm NutriBot 🤖 Ask me about meals, nutrition, or healthy choices!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await sendChatMessage(text);
      setMessages((prev) => [...prev, { from: "bot", text: res.data.response }]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Sorry, I'm having trouble right now. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-brand-500 hover:bg-brand-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 transition-colors"
        aria-label="Open chatbot"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-brand-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
            <span>🤖</span> NutriBot
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.from === "user"
                      ? "bg-brand-500 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-2xl text-sm text-gray-500 animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about nutrition..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              onClick={send}
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
