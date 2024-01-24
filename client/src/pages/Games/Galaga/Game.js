import React, { useEffect, useRef, useState } from "react";
import "./Galaga.css";
import "../../../css/Colors.css";
import enemyImgSrc from "../../../assets/enemy-ship.png";
import heroImgSrc from "../../../assets/hero-ship.png";
import galagaLogoSrc from "../../../assets/galaga-logo.png";
import { useNavigate } from "react-router-dom";
import { drawStartScreen, drawEndScreen, drawScoreHealth } from "./Canvas";
import { fireSound, backgroundSound } from "./Sound";
import {
  createVars,
  Player,
  drawEnemies,
  drawHealthkits,
  fire,
  updateBullets,
  updateEnemies,
  updateScoreHitEnemy,
  updateHealthKits,
  updateHealthHitKit,
} from "./Logic";
import Chat from "../../../pages/Chat/chat.js"

import axios from "axios";

const Galaga = ({ authState }) => {
  const canvasRef = useRef(null);
  const [startTime, setStartTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver] = useState(false);
  const navigate = useNavigate();

  const playShootSound = fireSound(false);

  const { playBackground, pauseBackground } = backgroundSound(gameOver);

  const sendGameResultsToAPI = async (score) => {
    const apiUrl = "http://localhost:3001/leaderboard/add"; 
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(apiUrl, {
        userId: accessToken.id, 
        gameId: "seuGameIdAqui", 
        result: score,
        victory: null,
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
    ctx.font = "1em Arial";

    const handleStart = () => {
      if (!gameOver) {
        setGameStarted(true);
        canvas.removeEventListener("click", handleStart);
        startGame();
      }
    };

    const drawStartButton = drawStartScreen(
      ctx,
      canvas,
      handleStart,
      galagaLogoSrc
    );

    const handleEnd = async (score) => {
      cancelAnimationFrame(animationFrameId);
      const currentPath = window.location.pathname;
      const parentPath = currentPath.split("/").slice(0, -1).join("/");
      console.log(score);
      navigate(parentPath);
      pauseBackground();
      //await sendGameResultsToAPI(score);
    };

    let animationFrameId;

    const startGame = () => {
      setStartTime(performance.now());

      playBackground();

      const handleSpacebarPress = (event) => {
        if (event.code === "Space") {
          playShootSound();
          fire(ctx, mouse, player, bullets);
        }
      };

      var { mouse, player, bullets, enemies, healthkits, score, health } =
        createVars(canvas, heroImgSrc, enemyImgSrc);

      var newPlayer = new Player(ctx, mouse, player);

      const drawEnemiesInterval = setInterval(() => {
        if (!gameOver) {
          drawEnemies(canvas, ctx, enemies);
        }
      }, 2000);

      const drawHealthkitsInterval = setInterval(() => {
        if (!gameOver) {
          drawHealthkits(canvas, ctx, enemies, healthkits);
        }
      }, 20000);

      const handleMouseMove = (event) => {
        mouse.x = Math.max(0, Math.min(event.clientX, 950));
      };

      const animate = () => {
        if (health === 0) {
          cancelAnimationFrame(animationFrameId);

          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("keydown", handleSpacebarPress);

          const milliseconds = performance.now() - startTime;
          const seconds = Math.ceil(milliseconds / 1000);
          const drawEndButton = drawEndScreen(
            ctx,
            canvas,
            score,
            seconds,
            () => {
               // Mova o console.log(score) para dentro da função callback
              handleEnd(score);
            }
          );

          drawEndButton();

          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawScoreHealth(ctx, health, score, canvas);
        newPlayer.update();

        updateBullets(bullets);

        health = updateEnemies(canvas, enemies, health);

        updateHealthKits(healthkits);

        score = updateScoreHitEnemy(enemies, bullets, score);

        health = updateHealthHitKit(healthkits, bullets, health);

        animationFrameId = requestAnimationFrame(animate);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("keydown", handleSpacebarPress);

      animate();

      return () => {
        clearInterval(drawEnemiesInterval);
        clearInterval(drawHealthkitsInterval);
        cancelAnimationFrame(animationFrameId);
      };
    };

    if (!gameStarted) {
      drawStartButton();
      return;
    }
  }, [
    gameStarted,
    gameOver,
    startTime,
    navigate,
    playBackground,
    playShootSound,
    pauseBackground
  ]);

  return (
    <div className="container">
      <div>
        <div style={{backgroundColor: "yellow", padding: "25px", color: "black", fontSize:"40px", textAlign: "center", borderTopLeftRadius: "10px", borderTopRightRadius:"10px"}}>
          Galaga
        </div>
        <canvas className="canvas" ref={canvasRef} width={1000} height={600} />
      </div>
      <div>
        <div style={{backgroundColor: "yellow", padding: "25px", color: "black", fontSize:"40px", textAlign: "center", borderTopLeftRadius: "10px", borderTopRightRadius:"10px"}}>
          Chat
        </div>
        <Chat authState={authState} />
      </div>
    </div>
  );
};

export default Galaga;
