import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {  NavUserDemo } from "@/components/index";
import { Footer } from "@/components/index";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Centralized Management Panel",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className=" dark:bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className={`flex items-center justify-between gap-2 px-4 w-full`}>
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <NavUserDemo />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
