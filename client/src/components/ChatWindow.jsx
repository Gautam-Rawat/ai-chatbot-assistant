import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from "./Message";
import "../App.css";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // Generate unique session ID once
  useEffect(() => {
    const id = Date.now().toString();
    setSessionId(id);
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
        sessionId: sessionId,
      });

      const botMessage = {
        text: response.data.reply,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Error: Unable to fetch response from server.",
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">AI Chatbot Assistant</h2>

      <div className="chat-box">
        {messages.length === 0 && (
          <p className="welcome-text">
            Ask me anything about college or company information!
          </p>
        )}

        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}

        {loading && <p className="loading">Bot is typing...</p>}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;