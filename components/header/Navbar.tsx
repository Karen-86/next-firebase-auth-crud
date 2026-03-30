"use client";

import React from "react";
import {LOCAL_DATA} from "@/constants/index";
import { ButtonDemo, ModeToggle, NavUserDemo } from "@/components/index.js";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import { SidebarNavigationMenuDemo } from "./SidebarNavigationMenuDemo";
import Link from "next/link";
import { useAuthStore } from "@/modules/auth/store";

const { logo } = LOCAL_DATA.images;

export const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Blogs", href: "/blogs" },
];

export const dropdownLinksModules: { title: string; href: string; description: string }[] = [
  {
    title: "item 1",
    href: "/modules/item-1",
    description: "",
  },
  {
    title: "item 2",
    href: "/modules/item-2",
    description: "",
  },
  {
    title: "item 3",
    href: "/modules/item-3",
    description: "",
  },
];

export default function Navbar() {
  const authUser = useAuthStore(s=>s.authUser)

  return (
    <nav className="navbar absolute w-full">
      <div className="container py-3 flex items-center justify-between ">
        <Link href="/">
          <img src={logo} alt="" className="max-w-[50px] h-auto " />
        </Link>

        <NavigationMenuDemo />

        <div className="flex items-center">
          <div className="min-w-[88px] flex justify-end">
            {authUser ? (
              <NavUserDemo triggerClassName=" rounded-full! h-10 w-10 [&_.user-details]:hidden" />
            ) : (
              <Link href={`/sign-in`}>
                <ButtonDemo variant="ghost" text={`Sign In`} />
              </Link>
            )}
          </div>
          <SidebarNavigationMenuDemo />
        </div>

        {/* <div className="btn-group  gap-2 hidden lg:flex min-w-[100px] justify-end"></div> */}
      </div>
    </nav>
  );
}
