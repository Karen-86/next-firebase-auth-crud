import React, { useState, useEffect } from "react";
import {LOCAL_DATA} from "@/constants/index";
import { ButtonDemo, DialogDemo, InputDemo, TextareaDemo, CropDemo } from "@/components/index";
import { Camera, X } from "lucide-react";
import { DeleteUserDialog } from "../delete-user-dialog/DeleteUserDialog";
import useUtil from "@/hooks/useUtil";
import useAlert from "@/hooks/useAlert";
import { useAuthStore } from "@/modules/auth/store";
import { useUserStore } from "@/modules/users/store";
import { useBannerStore } from "@/modules/banners/store";

const { bannerPlaceholderImage, avatarPlaceholderImage } = LOCAL_DATA.images;

const ProfileHeader = () => {
  const user = useAuthStore(s=>s.user)

  return (
    <div className="profile-header ">
      <div className="relative h-0 pt-[30%] bg-gray-100 rounded-lg ">
        {true && (
          <img
            className="banner absolute top-0 left-0 w-full h-full object-cover rounded-lg border"
            src={user.banner?.base64URL || bannerPlaceholderImage}
            alt=""
          />
        )}
        <div className=" w-[25%]  lg:w-[170px]  left-[5%]  absolute avatar translate-y-[50%] bottom-0 ">
          <div className="  w-[100%] h-0 pt-[100%] relative rounded-full border-2 border-white shadow-[0_0_6px_rgba(0,0,0,0.3)] overflow-hidden ">
            <img
              src={user.base64PhotoURL || user.photoURL || avatarPlaceholderImage}
              className="block absolute bg-gray-50 top-0 left-0 w-full h-full object-cover"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-3 mb-[15px] sm:mb-[5%] md:mb-[3%]">
        <div className="">
          <EditProfileDialog />
          <DeleteUserDialog userId={user.id} />
        </div>
      </div>

      <div className="md:pl-10 mb-10">
        <h2 className="font-bold text-2xl">{user.displayName}</h2>
        <div className="text-sm max-w-[380px] font-medium text-gray-500">{user.bio}</div>
      </div>
    </div>
  );
};

export default ProfileHeader;

const EditProfileDialog = () => {
  return (
    <DialogDemo
      trigger={<ButtonDemo text={`${"Edit Profile"}`} className={`mb-2 text-sm flex w-full`} variant="secondary" />}
    >
      {(closeDialog) => <EditProfileContent closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

type StateProps = {
  // isAvatarExist: boolean;
  isAvatarRemoved: boolean;
  newAvatar: string;

  // isBannerExist: boolean;
  isBannerRemoved: boolean;
  newBanner: string;

  name: string;
  bio: string;
};

const EditProfileContent = ({ closeDialog = () => {} }) => {
  const getProfileAsync = useAuthStore(s => s.getProfileAsync)
  const updateTargetUserAsync = useUserStore(s => s.updateTargetUserAsync)
  
  const user = useAuthStore(s=>s.user)
  const authUser = useAuthStore(s => s.authUser)
  const upsertBannerAsync = useBannerStore(s => s.upsertBannerAsync)
  
  const { convertToBase64, resizeBase64Image } = useUtil();
  const { successAlert } = useAlert();

  const [state, setState] = useState<StateProps>({
    // isAvatarExist: user.base64PhotoURL || user.photoURL,
    isAvatarRemoved: false,
    newAvatar: user.base64PhotoURL || user.photoURL || avatarPlaceholderImage,

    // isBannerExist: false,
    isBannerRemoved: false,
    newBanner: user.banner?.base64URL || bannerPlaceholderImage,

    name: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [src, setSrc] = useState("");
  const [croppedImageSrc, setCroppedImageSrc] = useState("");

  const [bannerSrc, setBannerSrc] = useState("");
  const [croppedBannerImageSrc, setCroppedBannerImageSrc] = useState("");

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // const compressedBlob = await compressImage(e.target.files[0], 300);
      const imageBase64 = await convertToBase64(e.target.files[0]);
      setSrc(imageBase64);

      e.target.value = "";
    }
  };
  const onSelectFileBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // const compressedBlob = await compressImage(e.target.files[0], 300);
      const imageBase64 = await convertToBase64(e.target.files[0]);
      setBannerSrc(imageBase64);

      e.target.value = "";
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // USER
    const fields: { [key: string]: any } = {};

    if (state.newAvatar !== avatarPlaceholderImage) {
      fields.base64PhotoURL = state.newAvatar;
    }
    if (state.isAvatarRemoved) {
      fields.base64PhotoURL = "";
      // fields.photoURL = "";
    }

    if (state.name !== user.displayName) {
      fields.displayName = state.name;
    }
    if (state.bio !== user.bio) {
      fields.bio = state.bio;
    }

    // BANNER
    const updatedBannerFields: { [key: string]: any } = {};

    if (state.newBanner !== bannerPlaceholderImage) {
      updatedBannerFields.base64URL = state.newBanner;
    }
    if (state.isBannerRemoved) {
      updatedBannerFields.base64URL = "";
    }

    // REQUESTS
    await Promise.all([
      updateTargetUserAsync({ userId: authUser?.uid, fields, hideAlert: true }),
      // updatedBannerFields.base64URL &&
        upsertBannerAsync({ bannerId: "banner-" + authUser?.uid, fields: { ...updatedBannerFields } }),
    ]);

    successAlert("User has been updated successfully.");

    closeDialog();
    getProfileAsync();
    setIsLoading(false);
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: user.displayName || "",
      bio: user.bio || "",
    }));
  }, [user]);

  return (
    <div>
      <CropAvatarDialog
        src={src}
        setSrc={setSrc}
        croppedImageSrc={croppedImageSrc}
        setCroppedImageSrc={setCroppedImageSrc}
        setState={setState}
      />
      <CropBannerDialog
        src={bannerSrc}
        setSrc={setBannerSrc}
        croppedImageSrc={croppedBannerImageSrc}
        setCroppedImageSrc={setCroppedBannerImageSrc}
        setState={setState}
      />
      <h2 className="text-2xl !font-semibold text-center mb-5">Edit Profile</h2>

      <div className="profile-header mb-[70px]">
        <div className="relative h-0 pt-[30%]">
          <div className="absolute top-0 left-0 w-full h-0 pt-[30%]  bg-gray-100 rounded-lg overflow-hidden">
            {true && (
              <img
                className="banner absolute top-0 left-0 w-full h-full object-cover rounded-lg border"
                src={state.newBanner}
                alt=""
              />
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] pointer-events-none"></div>

            <div className="banner-options  absolute top-[50%] right-0 transform-[translateY(-50%)] mr-5 flex  gap-1">
              <ButtonDemo
                onClick={() => {
                  const input = document.querySelector("#upload-banner") as HTMLInputElement | null;
                  input?.click();
                }}
                startIcon={<Camera />}
                className=" rounded-full w-[30px] sm:w-[35px] h-[30px] sm:h-[35px] bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.8)] !shadow-none"
              />
              <input id="upload-banner" type="file" accept="image/*" onChange={onSelectFileBanner} className="hidden" />
              {state.newBanner !== bannerPlaceholderImage && !state.isBannerRemoved && (
                <ButtonDemo
                  startIcon={<X />}
                  className=" rounded-full w-[30px] sm:w-[35px] h-[30px] sm:h-[35px] bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.8)] !shadow-none"
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      isBannerRemoved: true,
                      newBanner: bannerPlaceholderImage,
                    }));
                  }}
                />
              )}
            </div>
          </div>

          <div className="avatar-options w-[25%] left-[5%]  absolute avatar translate-y-[50%] bottom-0 ">
            <div className="  w-[100%] h-0 pt-[100%] relative rounded-full border-2 border-white shadow-[0_0_6px_rgba(0,0,0,0.3)] overflow-hidden ">
              <img
                src={state.newAvatar}
                className="block absolute bg-gray-50 top-0 left-0 w-full h-full object-cover"
                alt=""
              />
              <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] pointer-events-none"></div>

              <div className="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] flex  gap-1">
                <ButtonDemo
                  onClick={() => {
                    const input = document.querySelector("#upload-avatar") as HTMLInputElement | null;
                    input?.click();
                  }}
                  startIcon={<Camera />}
                  className=" rounded-full w-[30px] sm:w-[35px] h-[30px] sm:h-[35px] bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.8)] !shadow-none"
                />
                <input id="upload-avatar" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                {state.newAvatar !== avatarPlaceholderImage && !state.isAvatarRemoved && (
                  <ButtonDemo
                    startIcon={<X />}
                    className=" rounded-full w-[30px] sm:w-[35px] h-[30px] sm:h-[35px] bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.8)] !shadow-none"
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        isAvatarRemoved: true,
                        newAvatar: avatarPlaceholderImage,
                      }));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className={`${""}`}>
        <InputDemo
          label="Name"
          placeholder="Name"
          name="name"
          type="text"
          callback={(e) => onChange(e)}
          className="mb-5"
          value={state.name}
        />
        <TextareaDemo
          label={<div>Bio</div>}
          placeholder="Bio"
          name="bio"
          type="text"
          value={state.bio}
          callback={onChange}
          className="mb-5"
        />
        <div className="button-group flex gap-2 justify-end">
          <ButtonDemo className="" disabled={isLoading} text="Cancel" variant="outline" type="button" onClick={closeDialog} />
          <ButtonDemo className="" disabled={isLoading} text={`${isLoading ? "Loading..." : "Save"}`} />
        </div>
      </form>
    </div>
  );
};

// AVATAR DIALOG
const CropAvatarDialog = ({
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {
  const callback = (kkk: any) => {
    setSrc("");
  };
  return (
    <DialogDemo
      callback={callback}
      contentClassName="sm:max-w-[600px] py-[50px]  max-h-[100vh] overflow-y-auto"
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
      <div className="max-w-[500px] mx-auto flex mb-10">
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

// BANNER DIALOG
const CropBannerDialog = ({
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
      contentClassName="sm:max-w-[1000px] py-[50px] max-h-[100vh] overflow-y-auto"
      isDialogOpened={src ? true : false}
      trigger={<div className="hidden">hidden</div>}
    >
      {(closeDialog) => (
        <CropBannerDialogContent
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

const CropBannerDialogContent = ({
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
    <div className="crop-banner-dialog">
      <div className="max-w-[100%] mx-auto flex mb-10">
        <CropDemo src={src} aspect={20 / 7} scale={2} setCroppedImageSrc={setCroppedImageSrc} />
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

            if (size > 650) filteredImage = await resizeBase64Image(croppedImageSrc, 650);

            setState((prev: any) => ({ ...prev, newBanner: filteredImage, isBannerRemoved: false }));
            setSrc("");
            closeDialog();
          }}
        />
      </div>
    </div>
  );
};
