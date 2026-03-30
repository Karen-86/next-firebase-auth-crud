"use client"

import React, { useEffect, useState } from "react"
import { ButtonDemo, BreadcrumbDemo, TooltipDemo, UpdateEmailDialog, UpdateProfileDialog } from "@/components/index"
import { Card, CardContent } from "@/components/ui/card"
import { LOCAL_DATA } from "@/constants/index"
import { useAuthStore } from "@/modules/auth/store"
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions"
import { useUserStore } from "@/modules/users/store"

const { googleLogoIcon, avatarPlaceholderImage } = LOCAL_DATA.images
const { exclamationIcon, emailIcon, googleIcon } = LOCAL_DATA.svgs

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: "Profile",
  },
]

const Page = () => {
  return (
    <main className="pages-page mb-[150px] p-5">
      <h2 className="mb-3 text-2xl">Profile</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <SettingsProfile />
    </main>
  )
}

export const SettingsProfile = () => {
  const [isEmailPasswordMethodEnabled, setIsEmailPasswordMethodEnabled] = useState(false)
  const [isGoogleSignInMethodEnabled, setIsGoogleSignInMethodEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  const user = useAuthStore((s) => s.user)
  const authUser = useAuthStore((s) => s.authUser)
  const { handleSignInWithGoogle } = useAuthActions()
  const users = useUserStore(s=>s.users)

  const { email, roles, base64PhotoURL, photoURL, displayName } = user

  useEffect(() => {
    if (!authUser) return
    const _isEmailPasswordMethodEnabled = authUser.providerData.find((item) => item.providerId === "password")
    _isEmailPasswordMethodEnabled ? setIsEmailPasswordMethodEnabled(true) : setIsEmailPasswordMethodEnabled(false)

    const _isGoogleSignInMethodEnabled = authUser.providerData.find((item) => item.providerId === "google.com")
    _isGoogleSignInMethodEnabled ? setIsGoogleSignInMethodEnabled(true) : setIsGoogleSignInMethodEnabled(false)

    setIsEmailVerified(authUser.emailVerified)
  }, [authUser])

  const [admins, setAdmins] = useState<any[]>([])

  useEffect(() => {
    if (!users.length) return
    setAdmins(users.filter((user) => user.roles?.includes("admin")))
  }, [users])

  return (
    <div className="settings-profile">
      <Card className="mb-5">
        <CardContent className="text-xs font-medium">
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr_1fr]">
            <div className="text-1xl font-semibold">Profile</div>
            <div className="flex items-center gap-4">
              <div className="avatar-options avatar w-12">
                <div className="relative h-0 w-full overflow-hidden rounded-full pt-[100%] shadow-[0_0_6px_rgba(0,0,0,0.3)]">
                  <img
                    src={base64PhotoURL || photoURL || avatarPlaceholderImage}
                    className="absolute top-0 left-0 block h-full w-full bg-gray-50 object-cover"
                    alt=""
                  />
                </div>
              </div>
              <div>{displayName}</div>
            </div>
            <div>
              <div className="ml-auto w-fit">
                <UpdateProfileDialog />
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr_1fr]">
            <div className="text-1xl font-semibold">Email address</div>
            <div className="">
              {(isEmailPasswordMethodEnabled || isGoogleSignInMethodEnabled) && (
                <div className="flex items-start gap-2">
                  {authUser?.email}
                  {!isEmailVerified && (
                    <TooltipDemo
                      trigger={
                        <ButtonDemo
                          size="icon"
                          variant="ghost"
                          icon={exclamationIcon}
                          className="h-3.5 w-3.5 rounded-full border border-yellow-400 text-yellow-600 hover:text-yellow-600 [&>svg]:h-3! [&>svg]:w-3!"
                        />
                      }
                      content={<div>This email isn’t verified. Please check your inbox to verify it.</div>}
                    />
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="ml-auto w-fit">
                {/* {isEmailPasswordMethodEnabled && !isGoogleSignInMethodEnabled && <UpdateEmailDialog />} */}
                {<UpdateEmailDialog />}
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid items-center justify-between gap-2 sm:grid-cols-[1fr_1fr_1fr]">
            <div className="text-1xl font-semibold">Connected account</div>
            <div>
              {isGoogleSignInMethodEnabled ? (
                <div className="flex items-center gap-1">
                  <img className="max-w-[18px]" src={googleLogoIcon} alt="" />
                  <div>Google</div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <div>•</div> {authUser?.email}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400"></span>
              )}
            </div>
            <div>
              <div className="ml-auto w-fit">
                {!isGoogleSignInMethodEnabled && (
                  <div className="flex items-start gap-3">
                    <ButtonDemo
                      size="sm"
                      startIcon={<img src={googleLogoIcon} className="h-4" />}
                      text={`${isLoading ? "Signing In..." : "Connect Google"} `}
                      className={`text-xs text-gray-700 dark:text-white`}
                      disabled={isLoading}
                      variant="ghost"
                      onClick={() => handleSignInWithGoogle({setIsLoading})}
                    />
                    {!isEmailVerified && (
                      <TooltipDemo
                        trigger={
                          <ButtonDemo
                            size="icon"
                            variant="ghost"
                            icon={exclamationIcon}
                            className="h-3.5 w-3.5 rounded-full border border-yellow-400 text-yellow-600 hover:text-yellow-600 [&>svg]:h-3! [&>svg]:w-3!"
                          />
                        }
                        content={
                          <div>
                            We recommend verifying your email first before connecting Google to avoid losing the
                            password login method.
                          </div>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-gray-50 px-7 py-4 text-xs dark:bg-secondary">
        <div className="flex items-center justify-between gap-5 py-1">
          <div className="font-semibold">Providers:</div>
          <div className="font-medium capitalize">
            <div className="">
              {isGoogleSignInMethodEnabled && <div className="[&>svg]:h-5 [&>svg]:w-5">{googleIcon}</div>}
              {isEmailPasswordMethodEnabled && (
                <div className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:fill-current">{emailIcon}</div>
              )}
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between gap-5 py-1">
          <div className="font-semibold">Is email verified:</div>
          <div className="font-medium capitalize">{authUser?.emailVerified ? "Yes" : "No"}</div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between gap-5 py-1">
          <div className="font-semibold">Role(s):</div>
          <div className="font-medium capitalize">
            {roles?.map((role, index) => (
              <span key={index}>
                {role}
                {index < roles.length - 1 && ", "}
              </span>
            )) || "—"}
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between gap-5 py-1">
          <div className="font-semibold">Admin(s):</div>
          <div className="font-medium capitalize">
            {" "}
            {admins.length ? (
              admins.map((admin, index) => (
                <span key={index} className="">
                  {admin.displayName}
                  {index < admins.length - 1 && ", "}
                </span>
              ))
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between gap-5 py-1">
          <div className="font-semibold">Super Admin:</div>
          <div className="font-medium capitalize">
            {users.find((users) => users.roles?.includes("superAdmin"))?.displayName || (
              <span className="text-gray-400">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
