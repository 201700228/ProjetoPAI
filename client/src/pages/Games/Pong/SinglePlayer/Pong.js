import React, { useEffect, useRef, useState } from "react";
import "./Pong.css";
import "../../../../css/Colors.css";
import Chat from "../../../Chat/chat.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import pongLogo from "../../../../assets/pong-logo.png";

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
  const [showStartScreen, setShowStartScreen] = useState(true);
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

    const maxScore = 7;

    const paddles = {
      left: {
        x: 90,
        y: 200,
        height: 60,
        width: 20,
        speed: 5,
      },
      right: {
        x: 690,
        y: 200,
        height: 60,
        width: 20,
        speed: 50,
      },
    };

    const ball = {
      x: 395,
      y: 245,
      radius: 10,
      speedX: PONG_CONSTANTS.INITIAL_BALL_SPEED_X,
      speedY: PONG_CONSTANTS.INITIAL_BALL_SPEED_Y,
    };

    let leftScore = 0;
    let rightScore = 0;

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddles = () => {
      ctx.fillStyle = "blue";

      ctx.fillRect(
        paddles.left.x,
        paddles.left.y,
        paddles.left.width,
        paddles.left.height
      );

      if (paddles.right) {
        ctx.fillStyle = "red";
      }

      ctx.fillRect(
        paddles.right.x,
        paddles.right.y,
        paddles.right.width,
        paddles.right.height
      );
    };

    const drawScore = () => {
      ctx.font = `${canvas.width * 0.03}px Arial`;

      // Score do lado esquerdo (azul)
      ctx.fillStyle = "blue";
      const scoreLeft =
        paddles.left.x < 400
          ? 280 - (leftScore.toString().length - 1) * 12
          : 520;

      ctx.fillText(leftScore, scoreLeft, 50);

      // Score do lado direito (vermelho)
      ctx.fillStyle = "red";
      const scoreRight =
        paddles.right.x < 400
          ? 280 - (rightScore.toString().length - 1) * 12
          : 520;

      ctx.fillText(rightScore, scoreRight, 50);

      // Desenhar a linha divisória
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.setLineDash([10, 10]);

      const meioHorizontal = canvas.width / 2;

      ctx.moveTo(meioHorizontal, 0);
      ctx.lineTo(meioHorizontal, canvas.height);
      ctx.stroke();
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

    const drawStartScreen = () => {
      const backgroundImage = new Image();
      backgroundImage.src = pongLogo;

      const newSizeMultiplier = 0.3;
      const offsetYAdjustment = -30;

      backgroundImage.onload = function () {
        const aspectRatio = backgroundImage.width / backgroundImage.height;

        let newWidth = canvas.width * newSizeMultiplier;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > canvas.height) {
          newHeight = canvas.height * newSizeMultiplier;
          newWidth = newHeight * aspectRatio;
        }

        const offsetX = (canvas.width - newWidth) / 2;
        const offsetY =
          (canvas.height - newHeight) / 2 + offsetYAdjustment;

        ctx.drawImage(backgroundImage, offsetX, offsetY, newWidth, newHeight);

        ctx.font = "25px 'Press Start 2P', cursive";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(
          "PRESS START",
          canvas.width / 2,
          canvas.height / 2 + 70
        );

        canvas.style.cursor = "pointer";
        canvas.addEventListener("click", startGame);
      };
    };

    drawStartScreen();

    const startGame = () => {
      setShowStartScreen(false);
      draw();
    };

    const drawScreen = (mainText, additionalText = "") => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = "25px 'Press Start 2P', cursive";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(
        mainText,
        canvas.width / 2,
        canvas.height / 2 - 20
      );

      if (additionalText) {
        ctx.font = "20px 'Press Start 2P', cursive";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(
          additionalText,
          canvas.width / 2,
          canvas.height / 2 + 20
        );
      }
      canvas.style.cursor = "pointer";
      canvas.removeEventListener("click", startGame);
    };

    const handleGameClose = async (winner) => {
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
        winner = rightScore === maxScore ? "YOU WON!" : "YOU LOST!";
        setGameOver(true);
        drawScreen(winner);
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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="container-pong">
      <div>
        <canvas
          className="canvas-pong"
          ref={canvasRef}
          width={800}
          height={500}
        />
      </div>
      <div>
        <Chat authState={authState} />
      </div>
    </div>
  );
};

export default PongSP;
