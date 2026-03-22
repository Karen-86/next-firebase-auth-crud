"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ButtonDemo } from "@/components/index";

// function canvasPreview(image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop) {
//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;

//   const scaleX = image.naturalWidth / image.width;
//   const scaleY = image.naturalHeight / image.height;

//   canvas.width = crop.width;
//   canvas.height = crop.height;

//   ctx.drawImage(
//     image,
//     crop.x * scaleX,
//     crop.y * scaleY,
//     crop.width * scaleX,
//     crop.height * scaleY,
//     0,
//     0,
//     crop.width,
//     crop.height
//   );
// }

function canvasPreview(image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop, _scale: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const scale = _scale;

  // Upscale the canvas to the desired size
  canvas.width = crop.width * scale;
  canvas.height = crop.height * scale;

  // Draw the image, accounting for the scale
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scale,
    crop.height * scale
  );
}

export default function ImageCropper({
  src = "",
  aspect = 16 / 9,
  scale = 1,
  setCroppedImageSrc = (_: any) => {},
}) {
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );

    setCrop(newCrop);
  };

  useEffect(() => {
    if (completedCrop && imgRef.current && canvasRef.current) {
      canvasPreview(imgRef.current, canvasRef.current, completedCrop, scale);

      const mimeMatch = src.match(/^data:(.*?);base64,/);
      const mimeType = mimeMatch?.[1] || "image/png";
      const quality = 1.0;
      const dataUrl = canvasRef.current.toDataURL(mimeType, quality);
      setCroppedImageSrc(dataUrl);
    }
  }, [completedCrop]);

  return (
    <>
      {src && (
        <>
          {/* <div className=""> */}
          <ReactCrop
            className={`mx-auto`}
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            aspect={aspect}
            ruleOfThirds={true}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img ref={imgRef} src={src} onLoad={onImageLoad} className="" />
          </ReactCrop>
          {/* </div> */}
          <div className="hidden">
            <p className="text-sm">Cropped preview:</p>
            <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
          </div>
        </>
      )}
    </>
  );
}
