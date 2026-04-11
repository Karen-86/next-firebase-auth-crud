import React from "react";
import { BreadcrumbDemo } from "@/components/index";
import Template from "./Template";

const page = async () => {

  const breadcrumbItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      href: "/dashboard/website",
      label: "Website",
    },
    {
      label: `home`,
    },
  ];

  return (
    <main className="about-section-page p-5 pt-1">
      <h2 className="text-2xl mb-1 capitalize">Hero section</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <Template  />
    </main>
  );
};

export default page;
