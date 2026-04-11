"use client";

import React from "react";
import { BreadcrumbDemo, TableDemo } from "@/components/index";
import { Card, CardHeader } from "@/components/ui/card";

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: "Website",
  },
];

const sections = [
  {
    invoice: "1",
    name: "Metadata",
    href: "/dashboard/website/home/metadata/edit",
  },
  {
    invoice: "2",
    name: "Header",
    href: "/dashboard/website/home/header/edit",
    isDisabled: true,
  },
  {
    invoice: "3",
    name: "Hero",
    href: "/dashboard/website/home/sections/hero/edit",
  },
  {
    invoice: "4",
    name: "Features",
    href: "/dashboard/website/home/sections/features/edit",
    isDisabled: true,
  },
  {
    invoice: "5",
    name: "Contact",
    href: "/dashboard/website/home/sections/contact/edit",
    isDisabled: true,
  },
  {
    invoice: "6",
    name: "Footer",
    href: "/dashboard/website/home/footer/edit",
    isDisabled: true,
  },
];

const blog = [
  {
    invoice: "1",
    name: "Header",
    href: "/dashboard/website/blogs/blog/edit-header",
    isDisabled: true,
  },
  {
    invoice: "2",
    name: (
      <div>
        Blogs <span className="text-gray-500 text-xs"> (Metadata included)</span>
      </div>
    ),
    href: "/dashboard/website/blogs/edit",
    isDisabled: false,
  },
  {
    invoice: "3",
    name: "Footer",
    href: "/dashboard/website/blogs/blog/edit-footer",
    isDisabled: true,
  },
];

const Pages = () => {
  return (
    <main className="pages-page  p-5 pt-1 mb-[150px] ">
      <h2 className="text-2xl mb-1">Website</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <Card className="relative">
        <CardHeader>
          <h2 className="text-1xl font-bold mb-3">Home Page</h2>
          <TableDemo invoices={sections} />
        </CardHeader>
      </Card>
      <br />
      <br />

      <Card className=" relative">
        <CardHeader>
          <h2 className="text-1xl font-bold mb-3">Blogs Page</h2>
          <TableDemo invoices={blog} />
        </CardHeader>
      </Card>
    </main>
  );
};

export default Pages;
