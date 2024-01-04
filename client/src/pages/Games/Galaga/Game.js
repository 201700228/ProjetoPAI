import React, { useEffect, useRef, useState } from "react";
import "./Galaga.css";
import "../../../css/Colors.css";
import backgroundAudio from "../../../assets/galaga-background.mp3";
import shootAudio from "../../../assets/galaga-hit.wav";
import enemyImgSrc from "../../../assets/enemy-ship.png";
import heroImgSrc from "../../../assets/hero-ship.png";
import { useHistory } from "react-router-dom";
import {
  drawStartScreen,
  drawEndScreen,
  handleGameOver,
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
  const [gameStarted, setGameStarted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const history = useHistory();

  const playShootSound = fireSound(false, new Audio(shootAudio));

  const playBackgroundSound = backgroundSound(
    useRef(new Audio(backgroundAudio))
  );

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

    const drawStartButton = drawStartScreen(ctx, canvas, handleStart);

    const handleGameOverClick = handleGameOver(
      canvas,
      setGameOver,
      setFinalScore,
      setGameStarted,
      history
    );

    const drawGameOverScreen = drawEndScreen(
      ctx,
      canvas,
      finalScore,
      handleGameOverClick
    );

    if (gameOver) {
      drawGameOverScreen();
      return;
    }

    const startGame = () => {
      playBackgroundSound();
      canvas.addEventListener("mousedown", () => {
        playShootSound();
        fire(ctx, mouse, player, bullets);
      });

      var { mouse, player, bullets, enemies, healthkits, score, health } =
        createVars(canvas, heroImgSrc, enemyImgSrc);

      var newPlayer = new Player(ctx, mouse, player);

      setInterval(() => drawEnemies(canvas, ctx, enemies), 2000);

      setInterval(() => drawHealthkits(canvas, ctx, enemies, healthkits), 8000);

      const handleTouchMove = (event) => {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var touch = event.changedTouches[0];
        var touchX = parseInt(touch.clientX);
        var touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
        event.preventDefault();
        mouse.x = touchX;
        mouse.y = touchY;
      };

      const handleMouseMove = (event) => {
        mouse.x = event.clientX;
      };

      const animate = () => {
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawScoreHealth(ctx, health, score, canvas);
        newPlayer.update();

        updateBullets(bullets);

        health = updateEnemies(
          canvas,
          enemies,
          health,
          score,
          setFinalScore,
          setGameOver,
          drawGameOverScreen
        );

        if (health <= 0) {
          setFinalScore(score);
          setGameOver(true);
          drawGameOverScreen();
          return;
        }

        updateHealthKits(healthkits);

        score = updateScoreHitEnemy(enemies, bullets, score);

        health = updateHealthHitKit(healthkits, bullets, health);

        requestAnimationFrame(animate);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mousemove", handleMouseMove);
      animate();

      if (!gameStarted) {
        drawStartButton();
        return;
      }

      return () => {};
    };
  }, [
    gameStarted,
    finalScore,
    gameOver,
    history,
    playBackgroundSound,
    playShootSound,
  ]);

  return (
    <canvas className="canvas" ref={canvasRef} width={1000} height={600} />
  );
};

export default Galaga;
