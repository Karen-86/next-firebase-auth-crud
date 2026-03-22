"use client";

import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ButtonDemoProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  text?: ReactNode;
  variant?: "default" | "destructive" | "outline" | "outlineDanger" | "secondary" | "ghost" | "ghostDanger" | "link" | "success" | "ghostStrong";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | null | undefined;
  icon?: ReactElement | null;
  startIcon?: ReactElement | null;
  endIcon?: ReactElement | null;
  disabled?: boolean;
  onClick?: (_:any) => void;
};

export function ButtonDemo({
  className = "",
  text = "",
  variant = "default",
  size = "default",
  icon = null,
  startIcon = null,
  endIcon = null,
  color = "defaultColor",
  disabled = false,
  onClick = () => {},
  ...props
}: ButtonDemoProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={`${className} cursor-pointer fill-current`}
      onClick={onClick}
      {...props}
    >
      {startIcon}
      {text}
      {icon}
      {endIcon}
      {/* <div data-type={type}></div> */}
    </Button>
  );
}
