import React, { useEffect, useRef, useState } from "react";
import "./Pong.css";
import "../../../../css/Colors.css";
import Chat from "../../../Chat/chat.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PONG_CONSTANTS = {
  MAX_SCORE: 1,
  INITIAL_BALL_SPEED_X: 3,
  INITIAL_BALL_SPEED_Y: 3,
  BALL_SPEED_INCREMENT: 0.5,
  INITIAL_RIGHT_PADDLE_SPEED: 5,
  INCREASED_RIGHT_PADDLE_SPEED: 8,
};

const PongSP = ({ authState }) => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  const { gameId } = useParams();

  const sendGameResultsToAPI = async (winner) => {
    const apiUrl = "http://localhost:3001/leaderboards/add";

    try {
      const response = await axios.post(apiUrl, {
        userId: authState.id,
        gameId: +gameId,
        result: 0,
        victory: winner === authState.username ? 1 : 0,
        dateTime: new Date().toISOString(),
      });

      console.log("API call success:", response.data);
    } catch (error) {
      console.error("Error during API call:", error.message);
    }
  };

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
      white: "#FFF"
    };

    const maxScore = 7;

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
        speed: 50,
      },
    };

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speedX: PONG_CONSTANTS.INITIAL_BALL_SPEED_X,
      speedY: PONG_CONSTANTS.INITIAL_BALL_SPEED_Y,
    };

    let leftScore = 0;
    let rightScore = 0;

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.white;
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddles = () => {
      ctx.fillStyle = colors.white;
      ctx.fillRect(0, paddles.left.y, paddles.left.width, paddles.left.height);
      ctx.fillRect(
        canvas.width - paddles.right.width,
        paddles.right.y,
        paddles.right.width,
        paddles.right.height
      );
    };

    const drawScore = () => {
      const margin = canvas.width * 0.02;
      ctx.font = `${canvas.width * 0.03}px Arial`;
      ctx.fillText("CPU: " + leftScore, margin, canvas.width * 0.06);
      const usernameScoreText = `${authState.username}: ${rightScore}`;
      const usernameScoreWidth = ctx.measureText(usernameScoreText).width;

      ctx.fillText(
        usernameScoreText,
        canvas.width - margin - usernameScoreWidth,
        canvas.width * 0.06
      );
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
      ball.speedX = PONG_CONSTANTS.INITIAL_BALL_SPEED_X;
      ball.speedY = PONG_CONSTANTS.INITIAL_BALL_SPEED_Y;
    }

    function increaseBallSpeed() {
      ball.speedX +=
        PONG_CONSTANTS.BALL_SPEED_INCREMENT * (ball.speedX > 0 ? 1 : -1);
      ball.speedY +=
        PONG_CONSTANTS.BALL_SPEED_INCREMENT * (ball.speedY > 0 ? 1 : -1);
    }

    const update = () => {
      if (gameOver) {
        return;
      }
      ball.x += ball.speedX;
      ball.y += ball.speedY;

      if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.speedY = -ball.speedY;
      }
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
          leftScore++;
          resetBall();
        }
      }

      if (ball.x - ball.radius <= 0) {
        rightScore++;
        resetBall();
      }
      moveLeftPaddle();
    };

    const drawGameOverScreen = (winner) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      ctx.font = "50px Arial";
      ctx.fillStyle = colors.white;
    
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    
      const buttonWidth = 100;
      const buttonHeight = 40;
      const buttonX = canvas.width / 2 - buttonWidth / 2;
      const buttonY = canvas.height / 2 + 50;
    
      ctx.fillText(`${winner} GANHOU!`, canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = "#FFF";
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
      ctx.font = "18px 'Star Jedi', sans-serif";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText("CLOSE", canvas.width / 2, buttonY + buttonHeight / 2 + 5);
    
      const handleButtonClick = () => {
        handleGameClose(winner);
        canvas.removeEventListener("click", handleButtonClick);
      };
    
      canvas.addEventListener("click", handleButtonClick);
    };

    const handleGameClose =  async (winner) => {
      const currentPath = window.location.pathname;
      const parentPath = currentPath.split("/").slice(0, -1).join("/");
      navigate(parentPath);
      sendGameResultsToAPI(winner);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddles();
      drawScore();
      update();

      if (leftScore === maxScore || rightScore === maxScore) {
        let winner;
        winner = leftScore === maxScore ? "CPU" : authState.username;
        setGameOver(true);
        drawGameOverScreen(winner);
        return;
      } else {
        requestAnimationFrame(draw);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp" && paddles.right.y > 0) {
        paddles.right.y -= PONG_CONSTANTS.INCREASED_RIGHT_PADDLE_SPEED;
      } else if (
        event.key === "ArrowDown" &&
        paddles.right.y + paddles.right.height < canvas.height
      ) {
        paddles.right.y += PONG_CONSTANTS.INITIAL_RIGHT_PADDLE_SPEED;
      }
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
        <canvas className="canvas-pong" ref={canvasRef} width={1000} height={600} />
      </div>
      <div>
        <Chat authState={authState} />
      </div>
    </div>
  );
};

export default PongSP;
