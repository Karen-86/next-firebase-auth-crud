import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { SheetDemo, AccordionDemo, NavUserDemo, ButtonDemo } from "@/components/index.js";
import { Menu, MoreVertical  } from "lucide-react";
import { usePathname } from "next/navigation";
import { navLinks, dropdownLinksModules } from "./Navbar";

export function SidebarNavigationMenuDemo() {
  const pathname = usePathname();

  return (
    <SheetDemo
      title="Menu"
      description="Lorem ipsum dolor."
      side="left"
      contentClassName=" overflow-y-auto flex [&>.sheet-body]:flex-1 [&>.sheet-body]:flex [&>.sheet-body]:flex-col"
      trigger={
        <Button size="icon" variant="ghost" className="lg:hidden cursor-pointer">
          <Menu />
        </Button>
      }
    >
      {(onClose) => (
        <>
          <nav className="navbar flex-1">
            <ul className="mt-5">
              {navLinks.map((item) => {
                const activeLink =
                  (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.title} className="list-none">
                    <Link
                      href={item.href}
                      className={`block py-2 px-4 hover:bg-slate-100 rounded-md ${activeLink ? "text-success" : ""}`}
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <AccordionDemo
              triggerClassName="text-[16px] font-normal !no-underline py-2 px-4 hover:bg-slate-100 rounded-md"
              items={[
                {
                  trigger: "Modules",
                  content: (
                    <ul>
                      {dropdownLinksModules.map((item, index) => {
                        const activeLink = pathname.startsWith(item.href);
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            className={`block py-2 px-4 hover:bg-slate-100 rounded-md ${activeLink ? "text-success" : ""}`}
                            onClick={onClose}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </ul>
                  ),
                },
              ]}
            />
          </nav>
          {/* <div className="">
            {currentUser ? (
              <NavUserDemo
                triggerClassName="rounded-md mb-2 w-[95%] mx-auto justify-start  "
                contentClassName="w-[--radix-dropdown-menu-trigger-width]!"
                align="center"
              />
            ) : (
              <Link href={"/sign-up"} className={` block py-2 px-4 hover:bg-slate-100 rounded-md`} onClick={onClose}>
                Sign Up
              </Link>
            )}
          </div> */}
        </>
      )}
    </SheetDemo>
  );
}
