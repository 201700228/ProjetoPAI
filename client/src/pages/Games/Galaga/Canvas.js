export function drawStartScreen(ctx, canvas, handleStart) {
  return () => {
    ctx.fillStyle = "#000"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px";
    ctx.fillStyle = "#ffcc00";
    ctx.textAlign = "center";
    ctx.fillText("Começar", canvas.width / 2, canvas.height / 2 + 10);
    canvas.addEventListener("click", handleStart);
  };
}

export function drawEndScreen(ctx, canvas, finalScore, gameOverFunc) {
    return () => {
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
  
      canvas.addEventListener("click", gameOverFunc);
    };
  }

export function handleGameOver(canvas, setGameOver, setFinalScore, setGameStarted, history) {
    return (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
  
      if (mouseX > canvas.width / 2 - 80 &&
        mouseX < canvas.width / 2 + 20 &&
        mouseY > canvas.height / 2 + 30 &&
        mouseY < canvas.height / 2 + 70) {
        // Recomeçar o jogo
        setGameOver(false);
        setFinalScore(0);
        setGameStarted(false);
      } else if (mouseX > canvas.width / 2 + 30 &&
        mouseX < canvas.width / 2 + 110 &&
        mouseY > canvas.height / 2 + 30 &&
        mouseY < canvas.height / 2 + 70) {
        // Sair do jogo
        history.push("/");
      }
    };
  }

  export function drawScoreHealth(ctx, health, score, canvas) {
    ctx.font = "20px 'Star Jedi', sans-serif";
    ctx.fillStyle = "#ffcc00";
    ctx.textAlign = "left";
    ctx.fillText("Health: " + health, 20, 30);
    ctx.fillText("Score: " + score, canvas.width - 120, 30);
  }