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
import Chat from "../../../pages/Chat/chat.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../helpers/AuthContext";

const Galaga = ({ authState: propAuthState }) => {
  const { authState } = useContext(AuthContext);
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver] = useState(false);
  const navigate = useNavigate();
  const { gameId } = useParams();

  const playShootSound = fireSound(false);

  const { playBackground, pauseBackground } = backgroundSound(gameOver);

  const sendGameResultsToAPI = async (score) => {
    const apiUrl = "http://localhost:3001/leaderboards/add";

    try {
      const response = await axios.post(apiUrl, {
        userId: authState.id,
        gameId: +gameId,
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
      navigate(parentPath);
      pauseBackground();
      await sendGameResultsToAPI(score);
    };

    let animationFrameId;

    const startGame = () => {

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
        mouse.x = Math.max(0, Math.min(event.clientX, 750));
      };

      const animate = () => {
        if (health === 0) {
          cancelAnimationFrame(animationFrameId);

          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("keydown", handleSpacebarPress);

          const drawEndButton = drawEndScreen(
            ctx,
            canvas,
            score,
            () => {
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
    navigate,
    playBackground,
    playShootSound,
    pauseBackground,
  ]);

  return (
    <div className="container-galaga">
      <div>
        <canvas className="canvas" ref={canvasRef} width={800} height={500} />
      </div>
      <div>
        <Chat authState={authState} defaultTopic="Galaga" />
      </div>
    </div>
  );
};

export default Galaga;
