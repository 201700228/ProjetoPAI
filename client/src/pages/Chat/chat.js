import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socket = io("http://localhost:3001");

  useEffect(() => {
    console.log("Connecting to socket...");

    // Set up event listeners for socket.io
    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", handleReceiveMessage);

    // Clean up the socket connection when component unmounts
    return () => {
      console.log("Disconnecting from socket...");
      socket.off("message", handleReceiveMessage);
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  useEffect(() => {
    // Fetch previous messages when the component mounts
    const fetchPreviousMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/messages/all");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchPreviousMessages();
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("message", { text: messageInput });
      setMessageInput("");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
      <div style={{ height: "200px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((message, index) => (
          <div key={index}>{message.text}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
