import React from "react";

const useUtil = () => {
  type FileInput = File | Blob;

  const compressImage = (
    file: FileInput,
    targetSizeKB: number = 300,
    // scale: number = 0.8,
    // quality: number = 0.8
    scale: number = 1.0,
    quality: number = 1.0
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (file.size / 1024 <= targetSizeKB) {
        console.log("trigger");
        // If file is already under target size, resolve with the original file
        resolve(file);
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width * scale;
        let height = img.height * scale;

        // Create a loop to reduce image size until it is under the target size
        const checkSize = () => {
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert the image to a blob and check its size
          canvas.toBlob(
            (blob: Blob | null) => {
              if (blob) {
                const sizeKB = blob.size / 1024; // Size in KB

                // If the size is greater than the target, reduce scale and quality
                if (sizeKB > targetSizeKB) {
                  scale *= 0.9; // Decrease scale
                  quality -= 0.05; // Decrease quality
                  checkSize(); // Try again with reduced scale and quality
                } else {
                  resolve(blob);
                }
              } else {
                reject(new Error("Failed to convert canvas to blob"));
              }
            },
            "image/jpeg",
            quality
          );
        };

        checkSize(); // Start the size-checking loop
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };

  const convertToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to read blob as Base64"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file as Base64"));
      };
    });
  };

  const resizeBase64Image = (base64Str: string, maxSizeKB: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject(new Error("Canvas context error"));
        ctx.drawImage(img, 0, 0);

        let low = 0.1;
        let high = 1.0;
        let bestMatch = canvas.toDataURL("image/jpeg", low); // fallback

        while (low <= high) {
          const mid = (low + high) / 2;
          const output = canvas.toDataURL("image/jpeg", mid);
          const sizeKB = Math.round((output.length * 3) / 4 / 1024);

          if (sizeKB <= maxSizeKB) {
            bestMatch = output;
            low = mid + 0.01; // try higher quality
          } else {
            high = mid - 0.01; // try lower quality
          }
        }

        resolve(bestMatch);
      };

      img.onerror = () => reject(new Error("Image load error"));
      img.src = base64Str;
    });
  };

  function formatTimestampToDate(timestamp: any) {
    const date = new Date(timestamp.seconds * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const formatWithCommas = (value: string) => {
    const num = value.replace(/,/g, "");
    if (!/^\d+$/.test(num)) return value;
    return Number(num).toLocaleString();
  };

  const unformatFromCommas = (value: string) => value.replace(/,/g, "");

  return {
    compressImage,
    convertToBase64,
    resizeBase64Image,
    formatTimestampToDate,
    formatWithCommas,
    unformatFromCommas,
  };
};

export default useUtil;
