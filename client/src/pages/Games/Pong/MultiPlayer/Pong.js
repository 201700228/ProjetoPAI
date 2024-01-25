import React, { useEffect, useRef } from "react";
import "./Pong.css";
import "../../../../css/Colors.css";
import Chat from "../../../Chat/chat.js"

const PongMP = ({ authState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const hiddenElement = document.createElement("div");
    hiddenElement.classList.add("colors-container");
    document.body.appendChild(hiddenElement);

    const computedStyles = getComputedStyle(hiddenElement);

    const colors = {
      pacman: computedStyles.getPropertyValue("--pacman").trim(),
      ghostBlue: computedStyles.getPropertyValue("--ghost-blue").trim(),
      ghostRed: computedStyles.getPropertyValue("--ghost-red").trim(),
      ghostOrange: computedStyles.getPropertyValue("--ghost-orange").trim(),
    };

    // Lógica do jogo aqui

    const paddles = {
      left: {
        y: canvas.height / 2 - 50,
        height: 100,
        width: 10,
        speed: 5,
      },
      right: {
        y: canvas.height / 2 - 50,
        height: 100,
        width: 10,
        speed: 8, // Increased speed for the right paddle
      },
    };

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speedX: 3,
      speedY: 3,
    };

    const initialBallSpeedX = 3;
    const initialBallSpeedY = 3;
    const ballSpeedIncrement = 0.5;

    const initialRightPaddleSpeed = 5;
    const increasedRightPaddleSpeed = 8;

    let leftScore = 0;
    let rightScore = 0;

    // ... (copie o resto da lógica do jogo)

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.pacman;
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddles = () => {
      ctx.fillStyle = colors.pacman;
      ctx.fillRect(0, paddles.left.y, paddles.left.width, paddles.left.height);
      ctx.fillRect(
        canvas.width - paddles.right.width,
        paddles.right.y,
        paddles.right.width,
        paddles.right.height
      );
    };

    const drawScore = () => {
      ctx.font = "30px Arial";
      ctx.fillText("Player 1: " + leftScore, 20, 40);
      ctx.fillText("Bernardo: " + rightScore, canvas.width - 170, 40);
    };

    const moveLeftPaddle = () => {
      const paddleCenter = paddles.left.y + paddles.left.height / 2;

      if (ball.y > paddleCenter) {
        paddles.left.y += paddles.left.speed;
      } else {
        paddles.left.y -= paddles.left.speed;
      }
    };

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.speedX = initialBallSpeedX;
      ball.speedY = initialBallSpeedY;
    }

    function increaseBallSpeed() {
      ball.speedX += ballSpeedIncrement * (ball.speedX > 0 ? 1 : -1);
      ball.speedY += ballSpeedIncrement * (ball.speedY > 0 ? 1 : -1);
    }

    const update = () => {
      ball.x += ball.speedX;
      ball.y += ball.speedY;

      // Collision with top/bottom walls
      if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.speedY = -ball.speedY;
      }

      // Collision with paddles
      if (
        ball.x - ball.radius <= paddles.left.width &&
        ball.y >= paddles.left.y &&
        ball.y <= paddles.left.y + paddles.left.height
      ) {
        ball.speedX = -ball.speedX;
        increaseBallSpeed();
      }

      if (ball.x + ball.radius >= canvas.width - paddles.right.width) {
        if (
          ball.y >= paddles.right.y &&
          ball.y <= paddles.right.y + paddles.right.height
        ) {
          ball.speedX = -ball.speedX;
          increaseBallSpeed();
        } else {
          leftScore++; // Increase left score
          resetBall();
        }
      }

      if (ball.x - ball.radius <= 0) {
        rightScore++; // Increase right score
        resetBall();
      }

      // Move the left paddle automatically
      moveLeftPaddle();
    };

    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp" && paddles.right.y > 0) {
        paddles.right.y -= increasedRightPaddleSpeed;
      } else if (
        event.key === "ArrowDown" &&
        paddles.right.y + paddles.right.height < canvas.height
      ) {
        paddles.right.y += increasedRightPaddleSpeed;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddles();
      drawScore();
      update();
      requestAnimationFrame(draw);
    };

    document.addEventListener("keydown", handleKeyDown);
    draw();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="container-pong">
      <div>
       
        <canvas className="canvas" ref={canvasRef} width={1000} height={600} />
      </div>
      <div>
        
        <Chat authState={authState} />
      </div>
    </div>
  );
};

export default PongMP;
