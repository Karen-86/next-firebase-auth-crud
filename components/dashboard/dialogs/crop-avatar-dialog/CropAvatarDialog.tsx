"use client";

import React from "react";
import { ButtonDemo,  DialogDemo, CropDemo } from "@/components/index";
import useUtil from "@/hooks/useUtil";
import {LOCAL_DATA} from "@/constants/index";


// AVATAR DIALOG
const CropAvatarDialog = ({
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {
  const callback = (kkk: any) => {
    console.log(kkk);
    setSrc("");
  };
  return (
    <DialogDemo
      callback={callback}
      contentClassName="sm:max-w-[600px] py-4 pt-6"
      isDialogOpened={src ? true : false}
      trigger={<div className="hidden">hidden</div>}
    >
      {(closeDialog) => (
        <CropAvatarDialogContent
          closeDialog={closeDialog}
          src={src}
          setSrc={setSrc}
          croppedImageSrc={croppedImageSrc}
          setCroppedImageSrc={setCroppedImageSrc}
          setState={setState}
        />
      )}
    </DialogDemo>
  );
};

const CropAvatarDialogContent = ({
  closeDialog = () => {},
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {
  const { resizeBase64Image } = useUtil();

  function getBase64ImageSize(base64String: any) {
    const padding = base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0;
    const base64Length = base64String.length;
    const sizeInBytes = (base64Length * 3) / 4 - padding;
    const sizeInKB = sizeInBytes / 1024;
    return { bytes: sizeInBytes, kilobytes: sizeInKB };
  }

  return (
    <div className="crop-avatar-dialog">
      <div className="max-w-[500px] mx-auto flex mb-5">
        <CropDemo src={src} aspect={1} setCroppedImageSrc={setCroppedImageSrc} />
      </div>
      <div className="button-group flex gap-2 justify-end">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog();
            setSrc("");
          }}
        />
        <ButtonDemo
          className=""
          text={`${"Apply"}`}
          onClick={async () => {
            const size = getBase64ImageSize(croppedImageSrc).kilobytes;
            let filteredImage = croppedImageSrc;

            if (size > 350) filteredImage = await resizeBase64Image(croppedImageSrc, 350);

            setState((prev: any) => ({ ...prev, newAvatar: filteredImage, isAvatarRemoved: false }));
            setSrc("");
            closeDialog();
          }}
        />
      </div>
    </div>
  );
};

export default CropAvatarDialog