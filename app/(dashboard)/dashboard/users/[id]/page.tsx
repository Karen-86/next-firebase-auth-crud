"use client";

import React, { useState, useEffect } from "react";
import { BreadcrumbDemo, Separator } from "@/components/index";
import {LOCAL_DATA} from "@/constants/index";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Expand } from "lucide-react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";

import ProfileHeader from "./profile-header/ProfileHeader";
import { useUserStore } from "@/modules/users/store";

const {} = LOCAL_DATA.images;

const {} = LOCAL_DATA.images;

const Page = () => {
  const params = useParams();
  const userId = params.id;

  const getTargetUserAsync = useUserStore(s=>s.getTargetUserAsync)
  const user = useAuthStore(s=>s.user)

  useEffect(() => {
    if (!userId) return;
    getTargetUserAsync({userId });
  }, [userId]);

  const breadcrumbItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      label: `Profile (${user.displayName})`,
    },
  ];
  if (userId === user?.id) {
    return (
      <main>
        <img className="max-w-[300px]" src="" alt="" />
      </main>
    );
  }

  return (
    <main className="pages-page p-5">
      {/* <h2 className="text-2xl mb-3 capitalize">{fetchedUser.details.role}</h2> */}
      <h2 className="text-2xl mb-3 capitalize">Profile</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Card className="mb-[150px] min-h-[500px] relative">
        <CardContent>
          <ProfileHeader details={user} />
          <UserInfoBlock details={user} />
        </CardContent>
      </Card>
    </main>
  );
};

// USER INFO BLOCK
const UserInfoBlock = ({ details = {} }: { details: any }) => {


  const user = useAuthStore(s=>s.user)
  return (
    <div className="relative py-5">
      <Separator title="Details" className="mb-3" titleClassName="bg-white" />
      <div className="settings mb-[80px] ml-auto flex justify-end"></div>
      <div className="relative">
        <div className=" max-w-[500px] w-full ">
          <div className="flex items-center justify-between text-sm gap-5 py-1 px-3 border-b-1 border-dashed border-input  mb-3">
            <div className="font-bold">Name:</div>
            <div>{details.displayName || "-"}</div>
          </div>
          <div className="flex items-center justify-between text-sm gap-5 py-1 px-3 border-b-1 border-dashed border-input  mb-3">
            <div className="font-bold">Email:</div>
            <div>
              {(details.email && user.roles?.some(role => ["admin", "superAdmin"].includes(role)) && details.email) || "***"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
