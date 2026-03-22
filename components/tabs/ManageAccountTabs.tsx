"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ItemsProps = {
  label: string;
  value: string;
  content?: ReactNode;
  icon?: ReactNode;
};

type TabsDemoProps = {
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  defaultValue?: string;
  items?: ItemsProps[];
};

export function ManageAccountTabs({
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
    <Tabs
      value={activeValue}
      onValueChange={setActiveValue}
      className={`${className}  md:flex-row  gap-x-5 py-5`}
      orientation="vertical"
    >
      <ScrollArea className="">
        <div>
          <h5 className="w-full  text-2xl font-medium!">Account</h5>
          <p className="text-xs w-full mb-5">Manage your account</p>
        </div>
        <TabsList
          className={`${tabsListClassName} w-full tab-list gap-y-1 p-0 mb-3 justify-start bg-transparent px-1  h-auto md:flex-col min-w-[200px]!`}
        >
          {items.map((item, index) => {
            return (
              <TabsTrigger
                key={index}
                value={item.value}
                className={`${tabsTriggerClassName} w-full  tabs-trigger cursor-pointer flex-0 shadow-none! text-gray-500 rounded-sm justify-start items-center  ${
                  activeValue === item.value ? "bg-gray-100! text-black dark:bg-black!" : ""
                } leading-none px-4 py-2`}
              >
                {item.icon}
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
