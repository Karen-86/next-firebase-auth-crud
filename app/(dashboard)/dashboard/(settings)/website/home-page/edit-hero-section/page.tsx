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
      label: `home page / hero Section`,
    },
  ];

  return (
    <main className="about-section-page py-5 px-10">
      <h2 className="text-2xl mb-3 capitalize">Hero section</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Template  />
    </main>
  );
};

export default page;
