import React from "react";
import "../App.css";

function Message({ text, sender }) {
    return (
        <div className={`message ${sender === "user" ? "user" : "bot"}`}>
            <div className="message-content">
                <p>{text}</p>
            </div>
        </div>
    );
}

export default Message;