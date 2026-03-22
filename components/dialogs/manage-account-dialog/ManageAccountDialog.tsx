"use client";

import React, { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { User, ShieldCheck } from "lucide-react";
import { ControlledDialogDemo, ManageAccountTabs } from "@/components/index";
import { SettingsProfile } from "@/app/(dashboard)/dashboard/(settings)/(account)/profile/page";
import { SettingsSecurity } from "@/app/(dashboard)/dashboard/(settings)/(account)/security/page";

const items = [
  {
    label: "Profile",
    value: "profile",
    content: <SettingsProfile />,
    icon: <User/>
  },
  {
    label: "Security",
    value: "security",
    content: <SettingsSecurity />,
    icon: <ShieldCheck/>
  },
];

const ManageAccountDialog = ({ isOpen = false, setIsOpen = () => {} }: any) => {
  return (
    <ControlledDialogDemo
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger=" "
      contentClassName="max-w-[890px]! gap-0 h-[calc(100vh-50px)] [&>.dialog-header]:hidden!   px-2 sm:px-5"
    >
      {(closeDialog) => <ManageAccountDialogContent closeDialog={closeDialog} />}
    </ControlledDialogDemo>
  );
};
const ManageAccountDialogContent = ({ closeDialog = () => {} }) => {
  return (
    <div>
      <ManageAccountTabs
        items={items}
      />
    </div>
  );
};

export default ManageAccountDialog;
