"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import  {compressImage, convertToBase64} from '@/lib/utils/imageUtils'

export default function UploadImage({
  id = "",
  url = "",
  state = '',
  setState =()=>{},
}:any) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (!state.images) return;
      setUploadedImage(e.target.files[0]);

      const compressedBlob = await compressImage(e.target.files[0], 300);
      const imageBase64 = await convertToBase64(compressedBlob);

      let tempImages = [...state.images];
      tempImages = tempImages.map((item) => {
        if (item.id !== id) return { ...item };
        return {
          ...item,
          url: imageBase64,
        };
      });
      setState((prev:any) => ({ ...prev, images: tempImages }));
    }
  };

  return (
    <div className="grid items-center gap-1.5 mb-5">
      <Label className="w-fit text-sm font-medium">Cover</Label>
      <div className="flex justify-center items-center border-2 border-dashed border-input p-4 rounded-md mb-3">
        <label className="cursor-pointer text-gray-600 font-semibold text-sm">
          {uploadedImage ? (
            <div className="text-center">
              <img
                src={URL.createObjectURL(uploadedImage)}
                alt="uploaded"
                className="w-[300px] h-[200px] object-contain mx-auto block "
              />
              {/* <p>Image Uploaded</p> */}
            </div>
          ) : (
            <div className="text-center">
              <img src={url} alt="" className="w-[300px] h-[200px] object-contain mx-auto block" />
              {/* {plusImage} */}
              {/* <p>Click to upload image</p> */}
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>
    </div>
  );
}
