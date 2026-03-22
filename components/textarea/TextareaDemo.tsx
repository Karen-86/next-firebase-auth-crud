"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

type InputDemoProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  inputClassName?: string;
  label?: ReactNode;
  callback?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errorMessage?: string;
  successMessage?: string;
};

export function TextareaDemo({
  className = "",
  inputClassName = "",
  label = "",
  callback = () => {},
  successMessage = "",
  errorMessage = "",
  ...props
}: InputDemoProps) {
  const [id, setId] = useState("");

  useEffect(() => {
    setId(uuidv4());
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    callback(e);
  };

  return (
    <div className={`field grid items-center gap-1.5 ${className}`}>
      {label && (
        <Label htmlFor={id} className="w-fit text-sm font-medium">
          {label}
        </Label>
      )}
      <Textarea
        id={id}
        {...props}
        onChange={onChange}
        className={`${inputClassName} ${errorMessage ? "border-red-400" : ""} min-h-[100px]`}
      />
      {successMessage && <div className="valid-feedback text-green-600 text-xs  mt-[-2px]">{successMessage}</div>}
      {errorMessage && <div className="invalid-feedback text-red-600 text-xs  mt-[-2px]">{errorMessage}</div>}
    </div>
  );
}
