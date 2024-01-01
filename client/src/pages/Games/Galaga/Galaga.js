import React, { useEffect, useRef, useState } from "react";
import "./Galaga.css";
import "../../../css/Colors.css";
import gameOverSound from "../../../assets/game-over.wav";
import shootSound from "../../../assets/space-hit.wav";
import enemyImgSrc from "../../../assets/enemy-ship.png";
import heroImgSrc from "../../../assets/hero-ship.png";
import { useHistory } from "react-router-dom";

const Galaga = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const history = useHistory();

  const shootAudio = new Audio(shootSound);
  let audioUnlocked = false;

  const playShootSound = () => {
    if (!audioUnlocked) {
      shootAudio.play().catch((error) => {
        console.error("Audio playback error:", error);
      });
      audioUnlocked = true;
    } else {
      shootAudio.currentTime = 0;
      shootAudio.play().catch((error) => {
        console.error("Audio playback error:", error);
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawStartButton = () => {
      ctx.fillStyle = "#000"; // Cor preta de fundo
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "40px 'Star Jedi', sans-serif";
      ctx.fillStyle = "#ffcc00";
      ctx.textAlign = "center";
      ctx.fillText("Começar", canvas.width / 2, canvas.height / 2 + 10);
      canvas.addEventListener("click", handleStart);
    };

    const handleGameOverClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (
        mouseX > canvas.width / 2 - 80 &&
        mouseX < canvas.width / 2 + 20 &&
        mouseY > canvas.height / 2 + 30 &&
        mouseY < canvas.height / 2 + 70
      ) {
        // Recomeçar o jogo
        setGameOver(false);
        setFinalScore(0);
        setGameStarted(false);
      } else if (
        mouseX > canvas.width / 2 + 30 &&
        mouseX < canvas.width / 2 + 110 &&
        mouseY > canvas.height / 2 + 30 &&
        mouseY < canvas.height / 2 + 70
      ) {
        // Sair do jogo
        history.push("/");
      }
    };

    const drawGameOverScreen = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "40px 'Star Jedi', sans-serif";
      ctx.fillStyle = "#ffcc00";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50);

      ctx.font = "24px 'Star Jedi', sans-serif";
      ctx.fillText(
        "Pontuação: " + finalScore,
        canvas.width / 2,
        canvas.height / 2
      );

      ctx.font = "20px 'Star Jedi', sans-serif";
      ctx.fillText("Recomeçar", canvas.width / 2 - 80, canvas.height / 2 + 50);
      ctx.fillText("Sair", canvas.width / 2 + 30, canvas.height / 2 + 50);

      canvas.addEventListener("click", handleGameOverClick);
    };

    if (gameOver) {
      drawGameOverScreen();
      return;
    }

    const handleStart = () => {
      if (!gameOver) {
        setGameStarted(true);
        canvas.removeEventListener("click", handleStart);
        startGame();
      }
    };

    const startGame = () => {
      canvas.addEventListener("mousedown", () => {
        playShootSound();
        fire();
      });

      const mouse = {
        x: canvas.width / 2,
        y: canvas.height - 33,
      };

      var player_width = 32;
      var player_height = 32;

      var score = 0;
      var health = 100;
      var playerImg = new Image();
      playerImg.src = heroImgSrc;

      var _bullets = [];
      var bullet_width = 6;
      var bullet_height = 8;
      var bullet_speed = 10;

      var _enemies = [];
      var enemyImg = new Image();
      enemyImg.src = enemyImgSrc;
      var enemy_width = 32;
      var enemy_height = 32;

      var _healthkits = [];
      var healthkitImg = new Image();
      healthkitImg.src = "https://image.ibb.co/gFvSEU/first_aid_kit.png";
      var healthkit_width = 32;
      var healthkit_height = 32;

      function Player(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.draw = function () {
          ctx.beginPath();
          ctx.drawImage(
            playerImg,
            mouse.x - player_width,
            mouse.y - player_height
          );
        };

        this.update = function () {
          this.draw();
        };
      }

      function Bullet(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
          ctx.beginPath();
          ctx.rect(this.x, this.y, this.width, this.height);
          ctx.fillStyle = "white";
          ctx.fill();
        };

        this.update = function () {
          this.y -= this.speed;
          this.draw();
        };
      }

      function Enemy(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
          ctx.beginPath();
          ctx.drawImage(enemyImg, this.x, this.y);
        };

        this.update = function () {
          this.y += this.speed;
          this.draw();
        };
      }

      function Healthkit(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
          ctx.beginPath();
          ctx.drawImage(healthkitImg, this.x, this.y);
        };

        this.update = function () {
          this.y += this.speed;
          this.draw();
        };
      }

      var __player = new Player(mouse.x, mouse.y, player_width, player_height);

      function drawEnemies() {
        for (var _ = 0; _ < 4; _++) {
          var x = Math.random() * (canvas.width - enemy_width);
          var y = -enemy_height;
          var width = enemy_width;
          var height = enemy_height;
          var speed = Math.random() * 2;
          var __enemy = new Enemy(x, y, width, height, speed);
          _enemies.push(__enemy);
        }
      }
      setInterval(drawEnemies, 1234);

      function drawHealthkits() {
        for (var _ = 0; _ < 1; _++) {
          var x = Math.random() * (canvas.width - enemy_width);
          var y = -enemy_height;
          var width = healthkit_width;
          var height = healthkit_height;
          var speed = Math.random() * 2.6;
          var __healthkit = new Healthkit(x, y, width, height, speed);
          _healthkits.push(__healthkit);
        }
      }
      setInterval(drawHealthkits, 15000);

      function fire() {
        for (var _ = 0; _ < 1; _++) {
          var x = mouse.x - bullet_width / 2;
          var y = mouse.y - player_height;
          var __bullet = new Bullet(
            x,
            y,
            bullet_width,
            bullet_height,
            bullet_speed
          );
          _bullets.push(__bullet);
        }
      }

      function collision(a, b) {
        return (
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y
        );
      }

      ctx.font = "1em Arial";

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

        ctx.font = "20px 'Star Jedi', sans-serif";
        ctx.fillStyle = "#ffcc00";
        ctx.textAlign = "left";
        ctx.fillText("Health: " + health, 20, 30);
        ctx.fillText("Score: " + score, canvas.width - 120, 30);
        __player.update();

        for (var i = 0; i < _bullets.length; i++) {
          _bullets[i].update();
          if (_bullets[i].y < 0) {
            _bullets.splice(i, 1);
          }
        }

        for (var k = 0; k < _enemies.length; k++) {
          _enemies[k].update();
          if (_enemies[k].y > canvas.height) {
            _enemies.splice(k, 1);
            health -= 10;
            if (health === 0) {
              setFinalScore(score);
              setGameOver(true);
              drawGameOverScreen();
              return;
            }
          }
        }

        for (var j = _enemies.length - 1; j >= 0; j--) {
          for (var l = _bullets.length - 1; l >= 0; l--) {
            if (collision(_enemies[j], _bullets[l])) {
              _enemies.splice(j, 1);
              _bullets.splice(l, 1);
              score++;
            }
          }
        }

        for (var h = 0; h < _healthkits.length; h++) {
          _healthkits[h].update();
        }
        for (var hh = _healthkits.length - 1; hh >= 0; hh--) {
          for (var hhh = _bullets.length - 1; hhh >= 0; hhh--) {
            if (collision(_healthkits[hh], _bullets[hhh])) {
              _healthkits.splice(hh, 1);
              _bullets.splice(hhh, 1);
              health += 10;
            }
          }
        }

        requestAnimationFrame(animate);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mousemove", handleMouseMove);
      animate();

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    };

    if (!gameStarted) {
      drawStartButton();
      return;
    }
  }, [gameStarted, finalScore, gameOver]);

  return (
    <canvas className="canvas" ref={canvasRef} width={1000} height={600} />
  );
};

export default Galaga;
