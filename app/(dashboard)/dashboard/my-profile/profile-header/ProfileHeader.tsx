import React, { useState, useEffect } from "react"
import { LOCAL_DATA } from "@/constants/index"
import { ButtonDemo, DialogDemo, InputDemo, TextareaDemo, CropDemo } from "@/components/index"
import { Camera, X } from "lucide-react"
import { DeleteUserDialog } from "../delete-user-dialog/DeleteUserDialog"
import  { convertToBase64, resizeBase64Image} from '@/lib/utils/imageUtils'
import {successAlert, errorAlert, warningAlert} from '@/lib/utils/alert'
import { useAuthStore } from "@/modules/auth/store"
import { useUserStore } from "@/modules/users/store"
import { useBannerStore } from "@/modules/banners/store"

const { bannerPlaceholderImage, avatarPlaceholderImage } = LOCAL_DATA.images

const ProfileHeader = ({ details = {} }: { details: any }) => {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="profile-header">
      <div className="relative h-0 rounded-lg bg-gray-100 pt-[30%]">
        {true && (
          <img
            className="banner absolute top-0 left-0 h-full w-full rounded-lg border object-cover"
            src={details?.banner?.base64URL || bannerPlaceholderImage}
            alt=""
          />
        )}
        <div className="avatar absolute bottom-0 left-[5%] w-[25%] translate-y-[50%] lg:w-[170px]">
          <div className="relative h-0 w-[100%] overflow-hidden rounded-full border-2 border-white pt-[100%] shadow-[0_0_6px_rgba(0,0,0,0.3)]">
            <img
              src={user.base64PhotoURL || user.photoURL || avatarPlaceholderImage}
              className="absolute top-0 left-0 block h-full w-full bg-gray-50 object-cover"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="mt-3 mb-[15px] flex justify-end sm:mb-[5%] md:mb-[3%]">
        <div className="">
          <EditProfileDialog details={details} />
          <DeleteUserDialog userId={user.id} />
        </div>
      </div>

      <div className="mb-10 md:pl-10">
        <h2 className="text-2xl font-bold">{user.displayName}</h2>
        <div className="max-w-[380px] text-sm font-medium text-gray-500">{user.bio}</div>
      </div>
    </div>
  )
}

export default ProfileHeader

const EditProfileDialog = ({ details = {} }) => {
  return (
    <DialogDemo
      trigger={
        <ButtonDemo
          text={`${"Edit Profile"}`}
          className={`mb-2 flex w-full text-sm`}
          variant="secondary"
        />
      }
    >
      {(closeDialog) => <EditProfileContent details={details} closeDialog={closeDialog} />}
    </DialogDemo>
  )
}

type StateProps = {
  // isAvatarExist: boolean;
  isAvatarRemoved: boolean
  newAvatar: string

  // isBannerExist: boolean;
  isBannerRemoved: boolean
  newBanner: string

  name: string
  bio: string
}

const EditProfileContent = ({
  details = {},
  closeDialog = () => {},
}: {
  details: any
  closeDialog: any
}) => {
  const getProfileAsync = useAuthStore((s) => s.getProfileAsync)
  const updateTargetUserAsync = useUserStore((s) => s.updateTargetUserAsync)

  const user = useAuthStore((s) => s.user)
  const authUser = useAuthStore((s) => s.authUser)

  const createBannerAsync = useBannerStore((s) => s.createBannerAsync)
  const updateBannerAsync = useBannerStore((s) => s.updateBannerAsync)

  const [state, setState] = useState<StateProps>({
    // isAvatarExist: user.base64PhotoURL || user.photoURL,
    isAvatarRemoved: false,
    newAvatar: user.base64PhotoURL || user.photoURL || avatarPlaceholderImage,

    // isBannerExist: false,
    isBannerRemoved: false,
    newBanner: details?.banner?.base64URL || bannerPlaceholderImage,

    name: "",
    bio: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const [src, setSrc] = useState("")
  const [croppedImageSrc, setCroppedImageSrc] = useState("")

  const [bannerSrc, setBannerSrc] = useState("")
  const [croppedBannerImageSrc, setCroppedBannerImageSrc] = useState("")

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // const compressedBlob = await compressImage(e.target.files[0], 300);
      const imageBase64 = await convertToBase64(e.target.files[0])
      setSrc(imageBase64)

      e.target.value = ""
    }
  }
  const onSelectFileBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // const compressedBlob = await compressImage(e.target.files[0], 300);
      const imageBase64 = await convertToBase64(e.target.files[0])
      setBannerSrc(imageBase64)

      e.target.value = ""
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // USER
    const fields: { [key: string]: any } = {}

    if (state.newAvatar !== avatarPlaceholderImage) {
      fields.base64PhotoURL = state.newAvatar
    }
    if (state.isAvatarRemoved) {
      fields.base64PhotoURL = ""
      // fields.photoURL = "";
    }

    if (state.name !== user.displayName) {
      fields.displayName = state.name
    }
    if (state.bio !== user.bio) {
      fields.bio = state.bio
    }

    // BANNER
    const updatedBannerFields: { [key: string]: any } = {}

    if (state.newBanner !== bannerPlaceholderImage) {
      updatedBannerFields.base64URL = state.newBanner
    }
    if (state.isBannerRemoved) {
      updatedBannerFields.base64URL = ""
    }

    let errorMessage = ""
    
    // REQUESTS
    await Promise.all([
      updateTargetUserAsync({
        userId: authUser?.uid,
        fields,
        errorCB: (m: string) => (errorMessage = m),
      }),
      !details?.banner?.id
        ? createBannerAsync({
            fields: { ...updatedBannerFields },
            errorCB: (m: string) => (errorMessage = m),
          })
        : updateBannerAsync({
            bannerId: details?.banner.id,
            fields: { ...updatedBannerFields },
            errorCB: (m: string) => (errorMessage = m),
          }),
    ])

    closeDialog()
    getProfileAsync()
    setIsLoading(false)

    if (errorMessage) return errorAlert(errorMessage)

    successAlert("User has been updated successfully.")
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: user.displayName || "",
      bio: user.bio || "",
    }))
  }, [user])

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
      <h2 className="mb-5 text-center text-2xl !font-semibold">Edit Profile</h2>

      <div className="profile-header mb-[70px]">
        <div className="relative h-0 pt-[30%]">
          <div className="absolute top-0 left-0 h-0 w-full overflow-hidden rounded-lg bg-gray-100 pt-[30%]">
            {true && (
              <img
                className="banner absolute top-0 left-0 h-full w-full rounded-lg border object-cover"
                src={state.newBanner}
                alt=""
              />
            )}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.3)]"></div>

            <div className="banner-options absolute top-[50%] right-0 mr-5 flex transform-[translateY(-50%)] gap-1">
              <ButtonDemo
                onClick={() => {
                  const input = document.querySelector("#upload-banner") as HTMLInputElement | null
                  input?.click()
                }}
                startIcon={<Camera />}
                className="h-[30px] w-[30px] rounded-full bg-[rgba(0,0,0,0.7)] !shadow-none hover:bg-[rgba(0,0,0,0.8)] sm:h-[35px] sm:w-[35px]"
              />
              <input
                id="upload-banner"
                type="file"
                accept="image/*"
                onChange={onSelectFileBanner}
                className="hidden"
              />
              {state.newBanner !== bannerPlaceholderImage && !state.isBannerRemoved && (
                <ButtonDemo
                  startIcon={<X />}
                  className="h-[30px] w-[30px] rounded-full bg-[rgba(0,0,0,0.7)] !shadow-none hover:bg-[rgba(0,0,0,0.8)] sm:h-[35px] sm:w-[35px]"
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      isBannerRemoved: true,
                      newBanner: bannerPlaceholderImage,
                    }))
                  }}
                />
              )}
            </div>
          </div>

          <div className="avatar-options avatar absolute bottom-0 left-[5%] w-[25%] translate-y-[50%]">
            <div className="relative h-0 w-[100%] overflow-hidden rounded-full border-2 border-white pt-[100%] shadow-[0_0_6px_rgba(0,0,0,0.3)]">
              <img
                src={state.newAvatar}
                className="absolute top-0 left-0 block h-full w-full bg-gray-50 object-cover"
                alt=""
              />
              <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.3)]"></div>

              <div className="absolute top-[50%] left-[50%] flex transform-[translate(-50%,-50%)] gap-1">
                <ButtonDemo
                  onClick={() => {
                    const input = document.querySelector(
                      "#upload-avatar"
                    ) as HTMLInputElement | null
                    input?.click()
                  }}
                  startIcon={<Camera />}
                  className="h-[30px] w-[30px] rounded-full bg-[rgba(0,0,0,0.7)] !shadow-none hover:bg-[rgba(0,0,0,0.8)] sm:h-[35px] sm:w-[35px]"
                />
                <input
                  id="upload-avatar"
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                  className="hidden"
                />
                {state.newAvatar !== avatarPlaceholderImage && !state.isAvatarRemoved && (
                  <ButtonDemo
                    startIcon={<X />}
                    className="h-[30px] w-[30px] rounded-full bg-[rgba(0,0,0,0.7)] !shadow-none hover:bg-[rgba(0,0,0,0.8)] sm:h-[35px] sm:w-[35px]"
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        isAvatarRemoved: true,
                        newAvatar: avatarPlaceholderImage,
                      }))
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
        <div className="button-group flex justify-end gap-2">
          <ButtonDemo
            className=""
            disabled={isLoading}
            text="Cancel"
            variant="outline"
            type="button"
            onClick={closeDialog}
          />
          <ButtonDemo
            className=""
            disabled={isLoading}
            text={`${isLoading ? "Loading..." : "Save"}`}
          />
        </div>
      </form>
    </div>
  )
}

// AVATAR DIALOG
const CropAvatarDialog = ({
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {
  const callback = (kkk: any) => {
    setSrc("")
  }
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
  )
}

const CropAvatarDialogContent = ({
  closeDialog = () => {},
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {

  function getBase64ImageSize(base64String: any) {
    const padding = base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0
    const base64Length = base64String.length
    const sizeInBytes = (base64Length * 3) / 4 - padding
    const sizeInKB = sizeInBytes / 1024
    return { bytes: sizeInBytes, kilobytes: sizeInKB }
  }

  return (
    <div className="crop-avatar-dialog">
      <div className="mx-auto mb-10 flex max-w-[500px]">
        <CropDemo src={src} aspect={1} setCroppedImageSrc={setCroppedImageSrc} />
      </div>
      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog()
            setSrc("")
          }}
        />
        <ButtonDemo
          className=""
          text={`${"Apply"}`}
          onClick={async () => {
            const size = getBase64ImageSize(croppedImageSrc).kilobytes
            let filteredImage = croppedImageSrc

            if (size > 350) filteredImage = await resizeBase64Image(croppedImageSrc, 350)

            setState((prev: any) => ({
              ...prev,
              newAvatar: filteredImage,
              isAvatarRemoved: false,
            }))
            setSrc("")
            closeDialog()
          }}
        />
      </div>
    </div>
  )
}

// BANNER DIALOG
const CropBannerDialog = ({
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {
  const callback = (kkk: any) => {
    console.log(kkk)
    setSrc("")
  }
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
  )
}

const CropBannerDialogContent = ({
  closeDialog = () => {},
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {

  function getBase64ImageSize(base64String: any) {
    const padding = base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0
    const base64Length = base64String.length
    const sizeInBytes = (base64Length * 3) / 4 - padding
    const sizeInKB = sizeInBytes / 1024
    return { bytes: sizeInBytes, kilobytes: sizeInKB }
  }

  return (
    <div className="crop-banner-dialog">
      <div className="mx-auto mb-10 flex max-w-[100%]">
        <CropDemo src={src} aspect={20 / 7} scale={2} setCroppedImageSrc={setCroppedImageSrc} />
      </div>
      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog()
            setSrc("")
          }}
        />
        <ButtonDemo
          className=""
          text={`${"Apply"}`}
          onClick={async () => {
            const size = getBase64ImageSize(croppedImageSrc).kilobytes
            let filteredImage = croppedImageSrc

            if (size > 650) filteredImage = await resizeBase64Image(croppedImageSrc, 650)

            setState((prev: any) => ({
              ...prev,
              newBanner: filteredImage,
              isBannerRemoved: false,
            }))
            setSrc("")
            closeDialog()
          }}
        />
      </div>
    </div>
  )
}
