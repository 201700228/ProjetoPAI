import React, { useEffect, useRef, useState } from "react";
import "./Pong.css";
import Chat from "../../../Chat/chat.js";
import io from "socket.io-client";

const PongMP = ({ authState }) => {
  const canvasRef = useRef(null);
  const socketRef = useRef();
  const [paddles, setPaddles] = useState({ left: { y: 0 }, right: { y: 0 } });
  const [ball, setBall] = useState({ x: 0, y: 0, speedX: 0, speedY: 0 });
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      socketRef.current.emit("joinGameRoom", { userId: authState.id });
    });

    socketRef.current.on("gameInit", (gameState) => {
      setPaddles(gameState.paddles);
      setBall(gameState.ball);
      setIsGameStarted(true);
      requestAnimationFrame(draw);
    });

    socketRef.current.on("gameUpdate", (gameState) => {
      setPaddles(gameState.paddles);
      setBall(gameState.ball);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsGameStarted(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [authState.id]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !paddles.left || !paddles.right) return;
  
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Desenhe os paddles
    ctx.fillStyle = "white";
    if (paddles.left.y !== undefined) {
      ctx.fillRect(0, paddles.left.y, 10, 100); // Paddle esquerdo
    }
    if (paddles.right.y !== undefined) {
      ctx.fillRect(canvas.width - 10, paddles.right.y, 10, 100); // Paddle direito
    }
  
    // Desenhe a bola
    ctx.beginPath();
    if (ball.x !== undefined && ball.y !== undefined) {
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
    }
  
    requestAnimationFrame(draw);
  };

  return (
    <div className="container-pong">
      <div>
        <canvas className="canvas-pong" ref={canvasRef} width={1000} height={600} />
      </div>
      <div>
        {isGameStarted ? (
          <Chat authState={authState} defaultTopic="Pong" />
        ) : (
          <p>Aguardando por outro jogador...</p>
        )}
      </div>
    </div>
  );
};

export default PongMP;
