"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  //   SheetClose,
  SheetContent,
  SheetDescription,
  //   SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode, useState } from "react";

type SheetDemoProps = {
  contentClassName?: string;
  title?: string;
  description?: string;
  side?: "right" | "top" | "bottom" | "left" | undefined;
  trigger?: ReactNode;
  children?: ReactNode | ((closeSheet: () => void) => ReactNode);
};

export function SheetDemo({
  contentClassName = "",
  title = "",
  description = "",
  side = "right",
  trigger = null,
  children = null,
}: SheetDemoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger ? trigger : <Button variant="outline">Open</Button>}</SheetTrigger>
      <SheetContent className={`${contentClassName} `} side={side}>
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="sheet-body">{typeof children === "function" ? children(closeSheet) : children}</div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" size="sm">
              Button
            </Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
