import React, { useEffect, useRef, useState } from "react";
import "./Galaga.css";
import "../../../css/Colors.css";

import enemyImgSrc from "../../../assets/enemy-ship.png";
import heroImgSrc from "../../../assets/hero-ship.png";
import galagaLogoSrc from "../../../assets/galaga-logo.png";
import { useHistory } from "react-router-dom";
import {
  drawStartScreen,
  drawEndScreen,
  drawScoreHealth,
} from "./Canvas";
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

const Galaga = () => {
  const canvasRef = useRef(null);
  const [startTime, setStartTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(true);
  const history = useHistory();

  const playShootSound = fireSound(false);

  const { playBackground, pauseBackground } = backgroundSound(gameOver);
  

  useEffect(() => {
    if (canvasVisible) {
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

      const handleEnd = () => {
        setCanvasVisible(false);
        cancelAnimationFrame(animationFrameId);
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
        }, 8000);

        const handleMouseMove = (event) => {
          mouse.x = Math.max(0, Math.min(event.clientX, 950));
        };

        const animate = () => {
          if (health === 0) {
            const milliseconds = performance.now() - startTime;
            const seconds = Math.ceil(milliseconds / 1000);
            const drawEndButton = drawEndScreen(
              ctx,
              canvas,
              score,
              seconds,
              handleEnd
            );

            drawEndButton();
            pauseBackground();
           
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
          // Limpar animações pendentes
          cancelAnimationFrame(animationFrameId);
        };
      };

      if (!gameStarted) {
        drawStartButton();
        return;
      }
    }
  }, [
    gameStarted,
    gameOver,
    history,
    startTime,
    canvasVisible,
    playBackground,
    playShootSound,
    pauseBackground
  ]);

  return (
    <div className="container">
      {canvasVisible && (
        <canvas className="canvas" ref={canvasRef} width={1000} height={600} />
      )}
    </div>
  );
};

export default Galaga;
