export function fireSound(audioUnlocked, shootAudio) {
  return () => {
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

export function backgroundSound(gameBackgroundAudio) {
  return () => {
    gameBackgroundAudio.current.loop = true;
    gameBackgroundAudio.current.play();
  };
}
