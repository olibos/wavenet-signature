export function optimizeProfileImage(base64Input: string, maxSize = 80, quality = 0.8) {
  return new Promise<[string, number, number]>((resolve, reject) => {
    const img = new Image();

    if (!base64Input.startsWith("data:")) {
      base64Input = "data:image/jpeg;base64," + base64Input;
    }

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      const { width, height } = img;

      let newWidth = width;
      let newHeight = height;

      if (width > height) {
        if (width > maxSize) {
          newWidth = maxSize;
          newHeight = (height * maxSize) / width;
        }
      } else {
        if (height > maxSize) {
          newHeight = maxSize;
          newWidth = (width * maxSize) / height;
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const jpegDataUri = canvas.toDataURL("image/jpeg", quality);

      resolve([jpegDataUri, newWidth, newHeight]);
    };

    img.onerror = reject;
    img.src = base64Input;
  });
}
