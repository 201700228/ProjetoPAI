export const sepia = (ctx, canvas) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const tr = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
    const tg = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
    const tb = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);

    data[i] = tr;
    data[i + 1] = tg;
    data[i + 2] = tb;
  }

  return imageData;
};

export const invert = (ctx, canvas) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  return imageData;
};

export const grayscale = (ctx, canvas) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  return imageData;
};

export const normal = (ctx, canvas) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);;

  return imageData;
}