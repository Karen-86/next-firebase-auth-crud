"use client"

import { BreadcrumbDemo, Separator } from "@/components/index"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

import ProfileHeader from "./profile-header/ProfileHeader"
import { useAuthStore } from "@/modules/auth/store"

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: "My Profile",
  },
]

const Page = () => {
  const user = useAuthStore((s) => s.user)

  return (
    <main className="pages-page p-5">
      <h2 className="mb-3 text-2xl">My Profile</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Card className="relative mb-[150px] min-h-[500px]">
        <CardContent>
          <ProfileHeader details={user} />
          <UserInfoBlock />
        </CardContent>
      </Card>
    </main>
  )
}

// USER INFO BLOCK
const UserInfoBlock = () => {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="relative py-5">
      <Separator title="Details" className="mb-3" titleClassName="bg-white" />
      <div className="relative">
        <div className=""></div>
        <div className="w-full max-w-[500px]">
          <div className="mb-3 flex items-center justify-between gap-5 border-b-1 border-dashed border-input px-3 py-1 text-sm">
            <div className="font-bold">Name:</div>
            <div>{user.displayName || "-"}</div>
          </div>
          <div className="mb-3 flex items-center justify-between gap-5 border-b-1 border-dashed border-input px-3 py-1 text-sm">
            <div className="font-bold">Email:</div>
            <div>{user.email || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
