"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  //   DialogClose,
  DialogContent,
  DialogDescription,
  //   DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ControlledDialogDemoProps = {
  contentClassName?: string;
  trigger?: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode | ((closeDialog: () => void) => ReactNode);
  isOpen: boolean;
  setIsOpen: (_: boolean) => void;
};

export function ControlledDialogDemo({
  contentClassName = "",
  trigger = null,
  title = "",
  description = "",
  children = null,
  isOpen = false,
  setIsOpen = () => {},
}: ControlledDialogDemoProps) {
    const closeDialog = () => setIsOpen(false);
    
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Open Dialog</Button>}</DialogTrigger>
      <DialogContent className={`${contentClassName} sm:max-w-[425px] overflow-y-auto`}>
        <DialogHeader className="dialog-header">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="dialog-body">{typeof children === "function" ? children(closeDialog) : children}</div>
        {/* <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Save changes</Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
