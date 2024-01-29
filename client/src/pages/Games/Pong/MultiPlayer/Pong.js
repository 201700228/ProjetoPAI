import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Chat from "../../../Chat/chat.js";
import "./Pong.css";
import pongLogo from "../../../../assets/pong-logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

class Player {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.score = 0;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    const scoreX =
      this.x < 400 ? 280 - (this.score.toString().length - 1) * 12 : 520;

    ctx.fillText(this.score, scoreX, 50);
  }
}

class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
const PongMP = ({ authState }) => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [ball, setBall] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerNo, setPlayerNo] = useState(0);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [roomID, setRoomID] = useState(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { gameId } = useParams();

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    return canvas.getContext("2d");
  };

  const getPlayer1 = () => {
    return player1;
  };

  const getPlayer2 = () => {
    return player2;
  };

  const getBall = () => {
    return ball;
  };

  const socket = useRef(
    io("http://localhost:3001", {
      transports: ["websocket"],
    })
  );

  const sendGameResultsToAPI = async (victory) => {
    const apiUrl = "http://localhost:3001/leaderboards/add";

    try {
      await axios.post(apiUrl, {
        userId: authState.id,
        gameId: +gameId,
        result: 0,
        victory: victory ? 1 : 0,
        dateTime: new Date().toISOString(),
      });

    } catch (error) {
    }
  };

  useEffect(() => {
    const startGame = () => {
      canvasRef.current.style.cursor = "default";

      if (socket.current.connected) {
        socket.current.emit("join");
        setShowStartScreen(false);
        drawScreen("WAITING FOR ANOTHER PLAYER ...");
      } else {
        drawScreen("REFRESH THE PAGE AND TRY AGAIN ...");
      }
    };

    const handleEnd = (victory) => {
      const currentPath = window.location.pathname;
      const parentPath = currentPath.split("/").slice(0, -1).join("/");
      navigate(parentPath);
      sendGameResultsToAPI(victory);
    };

    const drawScreen = (mainText, additionalText = "") => {
      const ctx = getCanvasContext();
    
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
      ctx.font = "25px 'Press Start 2P', cursive";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(
        mainText,
        canvasRef.current.width / 2,
        canvasRef.current.height / 2 - 20
      );
    
      if (additionalText) {
        ctx.font = "20px 'Press Start 2P', cursive";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(
          additionalText,
          canvasRef.current.width / 2,
          canvasRef.current.height / 2 + 20
        );
      }
    
      canvasRef.current.style.cursor = "pointer";
      canvasRef.current.removeEventListener("click", startGame);
    };

    const drawStartScreen = () => {
      const backgroundImage = new Image();
      const ctx = getCanvasContext();
      backgroundImage.src = pongLogo;

      const newSizeMultiplier = 0.3;
      const offsetYAdjustment = -30;

      backgroundImage.onload = function () {
        const aspectRatio = backgroundImage.width / backgroundImage.height;

        let newWidth = canvasRef.current.width * newSizeMultiplier;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > canvasRef.current.height) {
          newHeight = canvasRef.current.height * newSizeMultiplier;
          newWidth = newHeight * aspectRatio;
        }

        const offsetX = (canvasRef.current.width - newWidth) / 2;
        const offsetY =
          (canvasRef.current.height - newHeight) / 2 + offsetYAdjustment;

        ctx.drawImage(backgroundImage, offsetX, offsetY, newWidth, newHeight);

        ctx.font = "25px 'Press Start 2P', cursive";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(
          "PRESS START",
          canvasRef.current.width / 2,
          canvasRef.current.height / 2 + 70
        );

        canvasRef.current.style.cursor = "pointer";
        canvasRef.current.addEventListener("click", startGame);
      };
    };

    if (showStartScreen) drawStartScreen();

    const handleKeyDown = (event) => {
      if (isGameStarted) {
        if (event.key === "ArrowUp") {
          socket.current.emit("move", {
            roomID: roomID,
            playerNo: playerNo,
            direction: "up",
          });
        } else if (event.key === "ArrowDown") {
          socket.current.emit("move", {
            roomID: roomID,
            playerNo: playerNo,
            direction: "down",
          });
        }
      }
    };

    const draw = () => {
      const ctx = getCanvasContext();
      if (getPlayer1() && getPlayer2() && getBall()) {
        ctx.clearRect(0, 0, 1000, 600);

        if (getPlayer1() !== null) {
          getPlayer1().draw(ctx);
        }

        if (getPlayer2() !== null) {
          getPlayer2().draw(ctx);
        }

        if (getBall() !== null) {
          getBall().draw(ctx);
        }

        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.setLineDash([10, 10]);

        const meioHorizontal = canvasRef.current.width / 2;

        ctx.moveTo(meioHorizontal, 0);
        ctx.lineTo(meioHorizontal, canvasRef.current.height);
        ctx.stroke();
      }
    };

    socket.current.on("playerNo", (newPlayerNo) => {
      setPlayerNo(newPlayerNo);
    });

    socket.current.on("startingGame", (room) => {
      setIsGameStarted(true);
      let color = room.players[0].playerNo === playerNo ? "RED" : "BLUE";
      drawScreen("WE ARE GOING TO START THE GAME...", `YOU'RE THE ${color} PLAYER!`);
    });

    socket.current.on("startedGame", (room) => {
      setRoomID(room.id);

      setPlayer1(
        new Player(room.players[0].x, room.players[0].y, 20, 60, "red")
      );
      setPlayer2(
        new Player(room.players[1].x, room.players[1].y, 20, 60, "blue")
      );

      const player1Instance = getPlayer1();
      const player2Instance = getPlayer2();

      if (player1Instance !== null && room.players[0].score !== undefined) {
        player1Instance.score = room.players[0].score;
      }

      if (player2Instance !== null && room.players[1].score !== undefined) {
        player2Instance.score = room.players[1].score;
      }
      setBall(new Ball(room.ball.x, room.ball.y, 10, "white"));
    });

    socket.current.on("updateGame", (room) => {
      if (getPlayer1() && getPlayer2() && getBall()) {
        getPlayer1().y = room.players[0].y;
        getPlayer2().y = room.players[1].y;

        if (getPlayer1() !== null && room.players[0].score !== undefined) {
          getPlayer1().score = room.players[0].score;
        }

        if (getPlayer2() !== null && room.players[1].score !== undefined) {
          getPlayer2().score = room.players[1].score;
        }

        getBall().x = room.ball.x;
        getBall().y = room.ball.y;

        draw();
      }
    });

    socket.current.on("endGame", (room) => {
      setIsGameStarted(false);

      socket.current.emit("leave", roomID);

      setTimeout(() => {
        drawScreen(
          `${room.winner === playerNo ? "YOU WON!" : "YOU LOST!"}`
        );

        setTimeout(() => {
          canvasRef.current.style.cursor = "pointer";
          canvasRef.current.addEventListener("click", handleEnd(room.winner === playerNo));
        }, 5000); 
      }, 1);
    });

    window.addEventListener("keydown", handleKeyDown);
    draw();

    return () => {
      socket.current.off("playerNo");
      socket.current.off("startingGame");
      socket.current.off("startedGame");
      socket.current.off("updateGame");
      socket.current.off("endGame");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [player1, player2, ball, isGameStarted, playerNo, roomID]);

  return (
    <div className="container-pong">
      <div>
        <canvas
          id="canvas"
          className="canvas-pong"
          width={800}
          height={500}
          ref={canvasRef}
        ></canvas>
      </div>

      <div>
        <Chat authState={authState} />
      </div>
    </div>
  );
};

export default PongMP;
