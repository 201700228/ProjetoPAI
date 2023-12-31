export const getImageTypeFromBase64 = (base64String) => {
  if (base64String.startsWith("data:image/jpeg")) {
    return "image/jpeg";
  } else if (base64String.startsWith("data:image/png")) {
    return "image/png";
  } else if (base64String.startsWith("data:image/gif")) {
    return "image/gif";
  } else if (base64String.startsWith("data:image/webp")) {
    return "image/webp";
  } else {
    return null;
  }
};

export const imageDataToFile = (imageData, fileName, fileType) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], fileName, { type: fileType });
      resolve(file);
    }, fileType);
  });
};
