"use client";

import React from "react";
import { PanelLeft, Settings, ChevronRight, SettingsIcon } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {LOCAL_DATA} from "@/constants/index";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const { userIcon, userGearIcon, gridIcon, globIcon } = LOCAL_DATA.svgs;

const {} = LOCAL_DATA.images;

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: gridIcon,
      isDisabled: false,
    },
    {
      title: "My Profile",
      url: "/dashboard/my-profile",
      icon: userIcon,
      isDisabled: false,
    },
  ],
  settingsAccount: [
    {
      title: "Account",
      url: "/dashboard/website",
      icon: globIcon,
      isActive: false,
      items: [
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
        {
          title: "Security",
          url: "/dashboard/security",
        },
      ],
    },
  ],
  settingsRest: [
    {
      title: "Website",
      url: "/dashboard/website",
      icon: globIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props} className="sidebar ">
      <SidebarHeader className="py-[18px] ">
        <SidebarMenuButton className="hover:bg-transparent active:bg-transparent">
          <Link href="/">
            <h2
              className={`text-gray-600 text-lg font-medium group-data-[collapsible=icon]:hidden whitespace-nowrap duration-200 pointer-events-none`}
            >
              Logo
            </h2>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-gray-400 font-normal">App</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  className={` ${
                    (item.url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.url))
                      ? "bg-gray-200 hover:bg-neutral-200 dark:bg-neutral-700 "
                      : ""
                  }  px-3 py-[18px] `}
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-gray-400 font-normal">Settings</SidebarGroupLabel>
          <SidebarMenu>
            {data.settingsRest.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  className={` ${
                    (item.url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.url))
                      ? "bg-gray-200 hover:bg-neutral-200 dark:bg-neutral-700"
                      : ""
                  }  px-3 py-[18px]`}
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {data.settingsAccount.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible ">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Account" className="px-3 py-[18px] cursor-pointer">
                      {userGearIcon}
                      <span>Account</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={` ${
                              (subItem.url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(subItem.url))
                                ? "bg-neutral-200 hover:bg-neutral-200 dark:bg-neutral-700"
                                : ""
                            }  px-3 py-[18px]`}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hiddenz">
          <SidebarGroupLabel className="uppercase text-gray-400 font-normal">Projects</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className={`${"pointer-events-none text-gray-400"} px-3 py-[18px]`}>
                <Link href="/">
                  <PanelLeft />
                  <span className="text-custom-sm">Genrix</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-5">
        {/* <h6 className="mb-5 text-xs text-gray-400 group-data-[collapsible=icon]:opacity-0 duration-800 whitespace-nowrap">
          Created by Next.js
        </h6> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
