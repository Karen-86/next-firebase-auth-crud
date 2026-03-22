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
    href: "/dashboard/website/home-page/edit-metadata",
  },
  {
    invoice: "2",
    name: "Header",
    href: "/dashboard/website/home-page/edit-header",
    isDisabled: true,
  },
  {
    invoice: "3",
    name: "Hero",
    href: "/dashboard/website/home-page/edit-hero-section",
  },
  {
    invoice: "4",
    name: "Features",
    href: "/dashboard/website/home-page/edit-features-section",
    isDisabled: true,
  },
  {
    invoice: "5",
    name: "Contact",
    href: "/dashboard/website/home-page/edit-contact-section",
    isDisabled: true,
  },
  {
    invoice: "6",
    name: "Footer",
    href: "/dashboard/website/home-page/edit-footer",
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
        Blog <span className="text-gray-500 text-xs"> (dynamic page, Metadata included)</span>
      </div>
    ),
    href: "/dashboard/website/blogs/blog/edit-details",
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
    <main className="pages-page  p-5 mb-[150px] ">
      <h2 className="text-2xl mb-3">Website</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
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
          <h2 className="text-1xl font-bold mb-3">Blog Page</h2>
          <TableDemo invoices={blog} />
        </CardHeader>
      </Card>
    </main>
  );
};

export default Pages;
