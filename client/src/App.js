import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import msgLogo from "./Assets/msg-logo.png";
import io from "socket.io-client";
import messagetone from "./Assets/ting.mp3";

const App = () => {
  const [message, setMessage] = useState("");
  const messageContainerRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socketRef.current = socket;

    // const audio = new Audio(messagetone);

    const append = (message, position) => {
      const messageElement = document.createElement("div");
      messageElement.innerText = message;
      messageElement.classList.add("message");
      messageElement.classList.add(position);
      messageContainerRef.current.append(messageElement);
      // if (position === "left") {
      //   audio.play();
      // }
    };

    const name = prompt("Enter your name to join");
    socket.emit("new-user-joined", name);

    socket.on("user-joined", (name) => {
      append(`${name} joined the chat`, "left");
    });

    socket.on("receive", (data) => {
      append(`${data.name}: ${data.message}`, "left");
    });

    socket.on("left", (name) => {
      append(`${name} left the chat`, "left");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const append = (message, position) => {
        const messageElement = document.createElement("div");
        messageElement.innerText = message;
        messageElement.classList.add("message");
        messageElement.classList.add(position);
        messageContainerRef.current.append(messageElement);
      };

      append(`You: ${message}`, "right");
      socketRef.current.emit('send', message);
      setMessage("");
    }
  };

  return (
    <div className="main-container">
      <nav>
        <img className="logo" src={msgLogo} alt="Logo" />
        <h1>Welcome to Fun Chat App</h1>
      </nav>
      <div className="container" ref={messageContainerRef}></div>
      <div className="send">
        <form onSubmit={handleSubmit} id="send-container">
          <input
            type="text"
            name="messageInp"
            id="messageInp"
            placeholder="Enter chat"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
