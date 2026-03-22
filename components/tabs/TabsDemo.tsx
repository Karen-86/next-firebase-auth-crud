"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ItemsProps = {
  label: string;
  value: string;
  content?: ReactNode;
};

type TabsDemoProps = {
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  defaultValue?: string;
  items?: ItemsProps[];
};

export function TabsDemo({
  className = "",
  tabsListClassName = "",
  tabsTriggerClassName = "",
  items = [],
  defaultValue = "",
}: TabsDemoProps) {
  const [activeValue, setActiveValue] = useState(items[0]?.value || "");

  useEffect(() => {
    if (!defaultValue) return;
    setActiveValue(defaultValue);
  }, [defaultValue]);

  return (
    <Tabs value={activeValue} onValueChange={setActiveValue} className={`${className}`} orientation="vertical">
      <ScrollArea className="">
        <TabsList className={`${tabsListClassName} w-full tab-list gap-y-1 p-0 mb-3 justify-start bg-transparent`}>
          {items.map((item, index) => {
            return (
              <TabsTrigger
                key={index}
                value={item.value}
                className={`${tabsTriggerClassName} rounded-full tabs-trigger cursor-pointer flex-0 shadow-none! text-gray-500  ${
                  activeValue === item.value ? "bg-gray-100! text-black" : ""
                } leading-none px-4 py-2`}
              >
                {item.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {items.map((item, index) => {
        return (
          <TabsContent key={index} value={item.value}>
            {item.content}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
