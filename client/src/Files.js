export const getImageTypeFromBase64 = (base64String) => {
    if (base64String.startsWith('data:image/jpeg')) {
      return 'image/jpeg';
    } else if (base64String.startsWith('data:image/png')) {
      return 'image/png';
    } else if (base64String.startsWith('data:image/gif')) {
      return 'image/gif';
    } else if (base64String.startsWith('data:image/webp')) {
      return 'image/webp';
    } else {
      return null;
    }
  };