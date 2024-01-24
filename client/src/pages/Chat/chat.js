import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';

const Chat = ({ authState }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const socket = io("http://localhost:3001");
  const messagesContainerRef = useRef(null);

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

  // This useEffect will scroll the messages container to the bottom whenever new content is added
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const message = {
        text: messageInput,
        user: authState // Include the sender information
      };

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

  const handleEmojiSelect = (emoji) => {
    const input = document.getElementById("messageInput"); // Replace "messageInput" with the actual ID of your input field

    // Check if there is a selection
    if (input.selectionStart !== undefined && input.selectionEnd !== undefined) {
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;

      // Insert the emoji at the current cursor position
      setMessageInput((prev) => prev.substring(0, startPos) + emoji.native + prev.substring(endPos));
    } else {
      // If no selection, append emoji to the end of the input
      setMessageInput((prev) => prev + emoji.native);
    }

    setPickerVisible(false); // Close the Emoji Picker after selection
  };
  return (
    <>
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossOrigin="anonymous"></script>
      <div style={{ width: "550px", border: "5px solid white", padding: "20px", backgroundColor: "black" }}>
        <div
          style={{ height: "200px", width: "500px", overflowY: "auto", marginBottom: "10px" }}
          ref={messagesContainerRef}
        >
          {messages.map((message, index) => {
            return (() => {
              if (message.sender === authState.username) {
                return (
                  <div key={index} style={{ color: "black", padding: "5px", textAlign: "right" }}>
                    <strong style={{ color: "var(--pacman)" }}>{message.sender} </strong>
                    {message.profilePicture && (
                      <img
                        src={`data:image/png;base64,${message.profilePicture}`}
                        alt={`${message.sender}'s profile`}
                        style={{ width: "20px", height: "20px", marginLeft: "5px", borderRadius: "50%", marginBottom: "10px" }}
                      />
                    )}
                    <div>
                      <span style={{ backgroundColor: "yellow", padding: "5px", marginTop: "5px", marginBottom: "10px", marginTop: "10px", borderRadius: "10px 2px 10px 10px" }}>{message.text}</span>

                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} style={{ color: "black", padding: "5px", textAlign: "left" }}>
                    {message.profilePicture && (
                      <img
                        src={`data:image/png;base64,${message.profilePicture}`}
                        alt={`${message.sender}'s profile`}
                        style={{ width: "20px", height: "20px", marginRight: "5px", borderRadius: "50%", marginBottom: "10px" }}
                      />
                    )}
                    <strong style={{ color: "var(--pacman)" }}>{message.sender} </strong>
                    <div>
                      <span style={{ backgroundColor: "yellow", padding: "5px", marginTop: "5px", marginBottom: "10px", marginTop: "10px", borderRadius: "2px 10px 10px 10px" }}>{message.text}</span>
                    </div>
                  </div>
                );
              }
            })();
          })}






        </div>
        <div className="row">
          <input
            id="messageInput"
            className="form-control col"
            placeholder="Escrever mensagem..."
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
          >
          </input>
          <button type="button" className="btn col-auto ms-2" style={{ backgroundColor: "var(--pacman)", borderRadius: "50%", width: "41px" }} onClick={() => setPickerVisible(!isPickerVisible)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
            </svg>
          </button>
          <button type="button" className="btn col-auto ms-2" style={{ backgroundColor: "var(--pacman)", borderRadius: "50%", width: "41px" }} onClick={sendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </button>
        </div>
      </div>
      <div className={isPickerVisible ? 'd-block' : 'd-none'}>
        <Picker data={emojiData} previewPosition="none" onEmojiSelect={handleEmojiSelect} />
      </div>
    </>
  );
};

export default Chat;
