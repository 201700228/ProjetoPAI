export function drawStartScreen(ctx, canvas, handleStart, imageSrc) {
  return () => {
    const backgroundImage = new Image();
    backgroundImage.src = imageSrc;

    const newSizeMultiplier = 1.2;
    const offsetYAdjustment = -80;

    backgroundImage.onload = function () {
      const newWidth = backgroundImage.width * newSizeMultiplier;
      const newHeight = backgroundImage.height * newSizeMultiplier;

      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2 + offsetYAdjustment;

      ctx.drawImage(backgroundImage, offsetX, offsetY, newWidth, newHeight);

      ctx.font = "25px 'Press Start 2P', cursive";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText("PRESS START", canvas.width / 2, canvas.height / 2 + 70);

      canvas.style.cursor = "pointer";
      canvas.addEventListener("click", handleStart);
    };
  };
}

export function drawEndScreen(ctx, canvas, finalScore, gameTime, gameOverFunc) {
  return () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "60px 'Star Jedi', sans-serif";
    ctx.fillStyle = "#FFFE01";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 70);

    const scoreAndTimeText =
      "SCORE: " + finalScore + "  TIME: " + gameTime + " SECONDS";
    ctx.font = "20px 'Star Jedi', sans-serif"; 
    ctx.fillStyle = "#FFFE01"; 
    ctx.fillText(scoreAndTimeText, canvas.width / 2, canvas.height / 2 + 10);

    const buttonWidth = 100;
    const buttonHeight = 40;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2 + 50;

    ctx.fillStyle = "#FFFE01";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.font = "18px 'Star Jedi', sans-serif"; 
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("CLOSE", canvas.width / 2, buttonY + buttonHeight / 2 + 5);


    canvas.addEventListener("click", gameOverFunc);
  };
}

export function handleGameOver(
  canvas,
  setGameOver,
  setFinalScore,
  setGameStarted,
  history,
  gameTime 
) {
  return (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
      mouseX > canvas.width / 2 - 80 &&
      mouseX < canvas.width / 2 + 20 &&
      mouseY > canvas.height / 2 + 30 &&
      mouseY < canvas.height / 2 + 70
    ) {
      setGameOver(false);
      setFinalScore(0);
      setGameStarted(false);
    } else if (
      mouseX > canvas.width / 2 + 30 &&
      mouseX < canvas.width / 2 + 110 &&
      mouseY > canvas.height / 2 + 30 &&
      mouseY < canvas.height / 2 + 70
    ) {
      history.push("/");
    }
  };
}

export function drawScoreHealth(ctx, health, score, canvas) {
  ctx.font = "20px 'Star Jedi', sans-serif";
  ctx.fillStyle = "#FFFE01";
  ctx.textAlign = "left";
  ctx.fillText("Health: " + health, 20, 30);
  ctx.fillText("Score: " + score, canvas.width - 120, 30);
}
