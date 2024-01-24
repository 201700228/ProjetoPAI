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

    console.log('handleReceiveMessage', handleReceiveMessage)
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
        const messagesWithSenderInfo = [];

        for (const message of response.data) {
          try {
            const senderResponse = await axios.get(`http://localhost:3001/users/${message.UserId}`);
            const sender = senderResponse.data;

            // console.log('sender.profilePicture', sender.profilePicture)
            
            if (sender) {
              messagesWithSenderInfo.push({
                text: message.text,
                sender: sender.username,
                profilePicture: sender.profilePicture,
              });
            } else {
              // Handle the case when sender is null
              messagesWithSenderInfo.push({
                text: message.text,
                sender: "Unknown User",
                profilePicture: null,
              });
            }
          } catch (senderError) {
            console.error(`Error fetching sender for message ID ${message.id}:`, senderError);
          }
        }

        setMessages(messagesWithSenderInfo);
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
        user: authState // Include the sender information
      };

      console.log('message', message);

      socket.emit("message", message);
      setMessageInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior (submitting the form)
      sendMessage();
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
      <div style={{ height: "200px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((message, index) => (
          <div key={index} style={{ color: "white" }}>
            {message.profilePicture && (
              <img
                src={`data:image/png;base64,${message.profilePicture}`}
                alt={`${message.sender}'s profile`}
                style={{ width: "20px", height: "20px", marginRight: "5px" }}
              />
            )}
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
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
