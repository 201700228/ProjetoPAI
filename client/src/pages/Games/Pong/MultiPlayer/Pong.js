import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Chat from "../../../Chat/chat.js";
import "./Pong.css";

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

    ctx.font = "20px Arial";
    ctx.fillText(
      this.score,
      this.x < 400 ? 370 - (this.score.toString().length - 1) * 12 : 420,
      30
    );

    ctx.fillRect(this.x < 400 ? 790 : 0, 0, 10, 600);
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
  const [roomID, setRoomID] = useState(null);

  const getCanvasContext = () => {
    const canvas = document.getElementById("canvas");
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

  const startBtn = useRef(null);

  useEffect(() => {
    const startGame = () => {
      startBtn.current.style.display = "none";

      if (socket.current.connected) {
        socket.current.emit("join");
        setMessage("Waiting for other player...");
      } else {
        setMessage("Refresh the page and try again...");
      }
    };

    startBtn.current && startBtn.current.addEventListener("click", startGame);

    const setMessage = (msg) => {
      const message = document.getElementById("message");
      message.innerText = msg;
    };

    const handleKeyDown = (event) => {
      if (isGameStarted) {
        if (event.key === "ArrowUp") {
          console.log("UP");
          socket.current.emit("move", {
            roomID: roomID,
            playerNo: playerNo,
            direction: "up",
          });
        } else if (event.key === "ArrowDown") {
          console.log("UP");
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

        // center line
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(400, 5);
        ctx.lineTo(400, 495);
        ctx.stroke();
      }
    };

    socket.current.on("playerNo", (newPlayerNo) => {
      setPlayerNo(newPlayerNo);
    });

    socket.current.on("startingGame", () => {
      setIsGameStarted(true);
      setMessage("We are going to start the game...");
    });

    socket.current.on("startedGame", (room) => {
      setRoomID(room.id);
      setMessage("");

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
      setMessage(
        `${room.winner === playerNo ? "You are Winner!" : "You are Loser!"}`
      );
      socket.current.emit("leave", roomID);

      setTimeout(() => {
        const ctx = getCanvasContext();
        ctx.clearRect(0, 0, 1000, 600);
        startBtn.current.style.display = "block";
      }, 2000);
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
      startBtn.current && startBtn.current.removeEventListener("click", startGame);
    };
  }, [player1, player2, ball, isGameStarted, playerNo, roomID]);

  return (
    <div className="container-pong">
      <div >
        <canvas
          id="canvas"
          className="canvas-pong"
          width={1000} height={600}
        ></canvas>
        <p id="message"></p>
        <button ref={startBtn} id="startBtn">
          START GAME
        </button>
      </div>

      <div>
        <Chat authState={authState} />
      </div>
    </div>
  );
}

export default PongMP;
