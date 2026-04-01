import { useState } from "react";
import axios from "axios";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:5000/api/chat", {
      message: input,
    });

    setMessages([
      ...messages,
      { text: input, sender: "user" },
      { text: res.data.reply, sender: "bot" },
    ]);

    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatWindow;