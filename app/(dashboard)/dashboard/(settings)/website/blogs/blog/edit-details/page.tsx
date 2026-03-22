import React from "react";
import { BreadcrumbDemo } from "@/components/index";
import Template from "./Template";

const page = async ({ params }: { params: Promise<{ section: string }> }) => {
  const section = (await params).section;
  // if (Number(slug) > 3) notFound();

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
      label: `blog page / details`,
    },
  ];

  return (
    <main className="blog-section-page py-5 px-5">
      <h2 className="text-2xl mb-3 capitalize">Blog details</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Template  />
    </main>
  );
};

export default page;
