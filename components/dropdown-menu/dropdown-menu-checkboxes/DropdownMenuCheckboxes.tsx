"use client";

import React, { ReactNode, ReactElement, useState, useEffect } from "react";
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ItemsProps = {
  name?: string;
  isChecked?: boolean;
  disabled?: boolean;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  id: string;
};

type DropdownProps = {
  trigger?: ReactNode;
  buttonName?: string;
  title?: string;
  triggerClassName?: string;
  contentClassName?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end",
  defaultItems: ItemsProps[];
  children?: ReactNode;
  callback?: (items: ItemsProps[]) => void;
};

export function DropdownMenuCheckboxes({
  trigger = null,
  buttonName = "Open",
  title = "",
  contentClassName = "",
  triggerClassName = "",
  variant = "outline",
  side = "bottom",
  align = 'center',
  defaultItems = [],
  children = null,
  callback = () => {},
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
  };

  const [items, setItems] = useState<ItemsProps[]>([]);

  useEffect(() => {
    setItems([...defaultItems]);
  }, [defaultItems]);

  const onCheckedChange = (id: string) => {
    let tempItems = [...items];
    tempItems = tempItems.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item));
    setItems(tempItems);
    callback(tempItems);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild className={`dropdown-menu-checkboxes-trigger ${triggerClassName}`}>
        {trigger || (
          <Button variant={variant} size="sm">
            {buttonName}
            <ChevronDown />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className={`w-56 mx-3 dropdown-menu-checkboxes-content ${contentClassName}`}>
        {title && <DropdownMenuLabel>{title}</DropdownMenuLabel>}
        {/* <DropdownMenuSeparator /> */}
        {items.length
          ? items.map((item, index) => {
              return (
                <DropdownMenuCheckboxItem
                  onSelect={(e) => e.preventDefault()}
                  key={index}
                  checked={item.isChecked}
                  onCheckedChange={() => onCheckedChange(item.id)}
                  disabled={item.disabled}
                  className="dropdown-menu-checkbox-item flex items-center gap-2"
                >
                  {item.startIcon && <span className="">{item.startIcon}</span>}
                  {item.name}
                  {item.endIcon && <span className="ml-auto">{item.endIcon}</span>}
                </DropdownMenuCheckboxItem>
              );
            })
          : ""}
        {children}
        {!items.length && !children && <div className="text-slate-400 text-sm px-2">Empty</div>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
