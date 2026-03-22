import React, { useState, useEffect } from "react";
import {LOCAL_DATA} from "@/constants/index";
import { ButtonDemo, DialogDemo, InputDemo, TextareaDemo, CropDemo } from "@/components/index";
import { Camera, X } from "lucide-react";

const { bannerPlaceholderImage, avatarPlaceholderImage } = LOCAL_DATA.images;

const ProfileHeader = ({details = {}}: {details: any}) => {
  return (
    <div className="profile-header ">
      <div className="relative h-0 pt-[50%] sm:pt-[30%] bg-gray-100 rounded-lg ">
        {true && (
          <img
            className="banner absolute top-0 left-0 w-full h-full object-cover rounded-lg border"
            src={details?.banner?.base64URL || bannerPlaceholderImage}
            alt=""
          />
        )}
        <div className=" w-[25%]  lg:w-[170px]  left-[5%]  absolute avatar translate-y-[50%] bottom-0 ">
          <div className="  w-[100%] h-0 pt-[100%] relative rounded-full border-2 border-white shadow-[0_0_6px_rgba(0,0,0,0.3)] overflow-hidden ">
            <img
              src={details.base64PhotoURL || details.photoURL || avatarPlaceholderImage}
              className="block absolute bg-gray-50 top-0 left-0 w-full h-full object-cover"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-3 mb-[15px] sm:mb-[5%] md:mb-[3%] opacity-0 pointer-events-none">
        <div className="">
          <ButtonDemo text="hidden" className="flex mb-1 " />
          <ButtonDemo text="hidden" className="flex" />
        </div>
      </div>

      <div className="md:pl-10 mb-10">
        <h2 className="font-bold text-2xl">{details.displayName}</h2>
        <div className="text-sm max-w-[380px] font-medium text-gray-500">{details.bio}</div>
      </div>
    </div>
  );
};

export default ProfileHeader;



