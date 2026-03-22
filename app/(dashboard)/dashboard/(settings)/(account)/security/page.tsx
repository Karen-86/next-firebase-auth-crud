"use client";

import React, { useEffect, useState } from "react";
import { BreadcrumbDemo, DeleteUserDialog, AddPasswordDialog, UpdatePasswordDialog } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/modules/auth/store";

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: "Security",
  },
];

const Page = () => {
  return (
    <main className="pages-page p-5 mb-[150px]">
      <h2 className="text-2xl mb-3">Security</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <SettingsSecurity/>
    </main>
  );
};


export const SettingsSecurity = () => {
  const [isEmailPasswordMethodEnabled, setIsEmailPasswordMethodEnabled] = useState(false);

  const user = useAuthStore(s=>s.user)
  const authUser = useAuthStore(s=>s.authUser)

  useEffect(() => {
    if (!authUser) return;
    const _isEmailPasswordMethodEnabled = authUser.providerData.find((item) => item.providerId === "password");
    if (_isEmailPasswordMethodEnabled) setIsEmailPasswordMethodEnabled(true);
  }, [authUser]);

  return (
    <div className="settings-security">
      <Card className="">
        <CardContent className="text-xs font-medium">
          <div className="grid sm:grid-cols-[1fr_1fr_1fr] items-center gap-4">
            <div className="text-1xl  font-semibold">Password</div>
            <div>{isEmailPasswordMethodEnabled && "•••••••••"}</div>
            <div>
              <div className="ml-auto w-fit">
                {!isEmailPasswordMethodEnabled && <AddPasswordDialog />}
                {isEmailPasswordMethodEnabled && <UpdatePasswordDialog />}
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid sm:grid-cols-[1fr_1fr_1fr] items-center gap-4">
            <div className="text-1xl  font-semibold">Delete account</div>
            <div></div>
            <div>
              <div className="ml-auto w-fit">
                <DeleteUserDialog userId={user.id} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
