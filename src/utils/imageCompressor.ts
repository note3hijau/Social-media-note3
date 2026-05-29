/**
 * Client-side utility to compress images using HTML5 Canvas.
 * This is essential to prevent QuotaExceededError in localStorage.
 */
export function compressImage(
  fileOrDataUrl: File | string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve) => {
    if (!fileOrDataUrl) {
      resolve('');
      return;
    }
    const processDataUrl = (dataUrl: string) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale bounds
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw image to canvas (this automatically downsamples it)
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as JPEG with lower quality (drastically reduces base64 size)
          const result = canvas.toDataURL('image/jpeg', quality);
          resolve(result);
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
    };

    if (fileOrDataUrl instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          processDataUrl(e.target.result as string);
        } else {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    } else {
      processDataUrl(fileOrDataUrl);
    }
  });
}
