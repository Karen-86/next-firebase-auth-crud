"use client"
import React, { useState, useEffect } from "react"

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles, Sun, Moon, User, ChevronDown, Settings } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ManageAccountDialog } from "@/components/index"
import { LOCAL_DATA } from "@/constants/index"
import { useAuthStore } from "@/modules/auth/store"
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions"

const { avatarPlaceholderImage, ellipsisPreloaderImage } = LOCAL_DATA.images

const { userIcon } = LOCAL_DATA.svgs

export default function NavUserDemo({
  trigger = "",
  triggerClassName = "",
  contentClassName = "",
  align = "end",
}: any) {
  const { handleSignOut } = useAuthActions()
  const user = useAuthStore((s) => s.user)
  const [_user, _setUser] = useState<any>({
    name: "",
    email: "",
    photoURL: null,
    base64PhotoURL: null,
  })
  const { theme, systemTheme, setTheme } = useTheme()

  const handleCycleTheme = () => {
    if (theme === "light") setTheme("dark")
    // else if (theme === "dark") setTheme("system");
    // else setTheme("light");
    else if (theme === "dark") setTheme("light")
  }

  useEffect(() => {
    _setUser({
      name: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || null,
      base64PhotoURL: user?.base64PhotoURL || null,
    })
  }, [user])

  const [isManageAccoundDialogOpen, setIsManageAccountDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={` ${triggerClassName} flex cursor-pointer items-center justify-center gap-2 rounded-sm px-2 py-1 outline-none hover:bg-gray-50 dark:hover:bg-secondary`}
        >
          <Avatar className="h-8 w-8 rounded-full border">
            <AvatarImage src={_user.base64PhotoURL || _user.photoURL} alt={_user.name} />
            <AvatarFallback className="rounded-full">
              <img src={avatarPlaceholderImage} alt="" />
            </AvatarFallback>
          </Avatar>
          <div className="user-details flex w-full items-center justify-between gap-2">
            {_user.name ? (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{_user.name}</span>
                <span className="truncate text-xs text-gray-500">{_user.email}</span>
              </div>
            ) : (
              <img className="max-w-[45px]" src={ellipsisPreloaderImage} alt="" />
            )}

            <ChevronDown className="ml-auto size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`${contentClassName} w-[95vw] max-w-[350px] rounded-lg p-0`}
          side={"bottom"}
          align={align}
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-4 px-5 py-4 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={_user.base64PhotoURL || _user.photoURL} alt={_user.name} />
                <AvatarFallback className="rounded-full">
                  <img src={avatarPlaceholderImage} alt="" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{_user.name}</span>
                <span className="truncate text-xs text-gray-500">{_user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          {/* <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup> */}

          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem asChild className="cursor-pointer rounded-none px-5 py-4">
            <Link className="" href="/dashboard/my-profile">
              <User className="w-8!" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem asChild className="cursor-pointer rounded-none px-5 py-4">
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsManageAccountDialogOpen(true)
              }}
            >
              <Settings className="w-8!" />
              Manage Account
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem className="cursor-pointer rounded-none px-5 py-4" onClick={handleCycleTheme}>
            <Sun className="h-[1.2rem] w-8! scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-8! scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            {theme}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem className="cursor-pointer rounded-none px-5 py-4" onClick={()=>handleSignOut()}>
            <LogOut className="w-8!" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ManageAccountDialog isOpen={isManageAccoundDialogOpen} setIsOpen={setIsManageAccountDialogOpen} />
    </>
  )
}
