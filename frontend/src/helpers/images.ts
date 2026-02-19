export function optimizeProfileImage(base64Input: string, maxSize = 140, quality = 0.9, round = true) {
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
      const sourceSize = Math.min(width, height);
      const size = Math.min(sourceSize, maxSize);
      const center = size / 2;
      const sourceX = (width - sourceSize) / 2;
      const sourceY = (height - sourceSize) / 2;
      canvas.width = size;
      canvas.height = size;
      if (round){
        ctx.beginPath();
        ctx.arc(center, center, center, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);

      if (round){
        ctx.beginPath();
        ctx.arc(center, center, center - 1, 0, Math.PI * 2);
        ctx.strokeStyle = "#E0E0E0";
        ctx.lineWidth = 2 * 1.5;
        ctx.stroke();
      }

      const dataUri = canvas.toDataURL("image/webp", quality);
      resolve([dataUri, size, size]);
    };

    img.onerror = reject;
    img.src = base64Input;
  });
}
