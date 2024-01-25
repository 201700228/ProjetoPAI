import React, { useEffect, useRef, useState } from "react";
import "./Pong.css";
import Chat from "../../../Chat/chat.js";
import io from "socket.io-client";
import axios from "axios";

const PONG_CONSTANTS = {
  MAX_SCORE: 7,
  INITIAL_BALL_SPEED_X: 3,
  INITIAL_BALL_SPEED_Y: 3,
  BALL_SPEED_INCREMENT: 0.5,
  INITIAL_RIGHT_PADDLE_SPEED: 5,
};

const PongMP = ({ authState }) => {
  const canvasRef = useRef(null);
  const socketRef = useRef();
  const [paddles, setPaddles] = useState({ left: { y: 0 }, right: { y: 0 } });
  const [ball, setBall] = useState({ x: 0, y: 0, speedX: 0, speedY: 0 });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [opponentUsername, setOpponentUsername] = useState("");

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`/users/basicinfo/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      socketRef.current.emit("joinGameRoom", { userId: authState.id });
    });

    socketRef.current.on("gameInit", async (gameState) => {
      console.log(gameState);
      setPaddles(gameState.paddles);
      setBall(gameState.ball);
      setLeftScore(gameState.scores.left);
      setRightScore(gameState.scores.right);
      console.log(gameState.opponentUsername);
      setOpponentUsername(gameState.opponentUsername);
      setIsGameStarted(true);
      requestAnimationFrame(draw);
    });

    socketRef.current.on("gameUpdate", (gameState) => {
      setPaddles(gameState.paddles);
      setBall(gameState.ball);
      setLeftScore(gameState.scores.left);
      setRightScore(gameState.scores.right);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsGameStarted(false);
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      socketRef.current.disconnect();
    };
  }, [authState.id, opponentUsername]);

  const handleKeyDown = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || !paddles.left || !paddles.right) return;

    if (event.key === "ArrowUp" && paddles.right.y > 0) {
      paddles.right.y -= PONG_CONSTANTS.INITIAL_RIGHT_PADDLE_SPEED;
      socketRef.current.emit("playerMove", { direction: "up" });
    } else if (
      event.key === "ArrowDown" &&
      paddles.right.y + paddles.right.height < canvas.height
    ) {
      paddles.right.y += PONG_CONSTANTS.INITIAL_RIGHT_PADDLE_SPEED;
      socketRef.current.emit("playerMove", { direction: "down" });
    }
  };

  const handleKeyUp = () => {
    // You can add logic here if needed
  };

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !paddles.left || !paddles.right) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "white";
    if (paddles.left.y !== undefined) {
      ctx.fillRect(0, paddles.left.y, 10, 100); // Left paddle
    }
    if (paddles.right.y !== undefined) {
      ctx.fillRect(canvas.width - 10, paddles.right.y, 10, 100); // Right paddle
    }

    // Draw ball
    ctx.beginPath();
    if (ball.x !== undefined && ball.y !== undefined) {
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
    }

    // Display scores
    ctx.font = "20px Arial";
    ctx.fillText(`${authState.username}: ${leftScore}`, 20, 30);
    ctx.fillText(`${opponentUsername}: ${rightScore}`, canvas.width - 150, 30);

    requestAnimationFrame(draw);
  };

  return (
    <div className="container-pong">
      <div>
        <canvas
          className="canvas-pong"
          ref={canvasRef}
          width={1000}
          height={600}
        />
      </div>
      <div>{isGameStarted ? <Chat authState={authState} /> : <p></p>}</div>
    </div>
  );
};

export default PongMP;
