import backgroundAudioSrc from "../../../assets/galaga-background.mp3";
import shootAudioSrc from "../../../assets/galaga-hit.wav";
import gameOverAudioSrc from "../../../assets/galaga-gameover.mp3";

export function fireSound(audioUnlocked) {
  return () => {
    const shootAudio = new Audio(shootAudioSrc);
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
}

export function backgroundSound(isGameOver) {
  const backgroundAudio = new Audio(backgroundAudioSrc);

  const playBackground = () => {
    if (!isGameOver) {
      backgroundAudio.loop = true;
      backgroundAudio.play().catch((error) => {
        console.error("Error playing background audio:", error);
      });
    }
  };

  const pauseBackground = () => {
    if (backgroundAudio.loop) {
      backgroundAudio.pause();
    }
  };

  return { playBackground, pauseBackground };
}

export function gameOverSound(isGameOver) {
  const gameOverAudio = new Audio(gameOverAudioSrc);

  const playGameOver = () => {
    if (isGameOver) {

      gameOverAudio.play().catch((error) => {
        console.error("Error playing game over audio:", error);
      });
    }
  };

  const pauseGameOver = () => {
    if (!isGameOver) {
      gameOverAudio.pause();
    }
  };

  return { playGameOver, pauseGameOver };
}
