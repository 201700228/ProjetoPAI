import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const Chat = ({ authState }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socket = io("http://localhost:3001");

  useEffect(() => {
    console.log("Connecting to socket...");

    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", handleReceiveMessage);

    return () => {
      console.log("Disconnecting from socket...");
      socket.off("message", handleReceiveMessage);
      socket.disconnect();
    };
  }, []); 

  useEffect(() => {
    const fetchPreviousMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/messages/all");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchPreviousMessages();
  }, []); 

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const message = {
        text: messageInput,
        sender: authState.username, // Include the sender information
      };

      console.log('message sender', message.sender)
      socket.emit("message", message);
      setMessageInput("");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
      <div style={{ height: "200px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((message, index) => (
          <div key={index} style={{color: "white"}}>
            <strong>{message.sender}: </strong>
            {message.text}
          </div>
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
