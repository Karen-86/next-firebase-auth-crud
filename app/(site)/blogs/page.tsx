import React from "react";
import Template from "./Template";
import * as blogFetchers from "@/modules/blogs/fetchers"

export const revalidate = 60; // 1min
// export const dynamic = "force-dynamic";

export default async function Blogs() {
  const { data } = await blogFetchers.fetchBlogs();

  return <Template blogData={data} />;
}

