import React from "react";
import BlogDetails from "./BlogDetails";
import * as blogFetchers from "@/modules/blogs/fetchers"
import { Blog } from "@/modules/blogs/types";
import { notFound } from "next/navigation";

export const revalidate = 60; // 1min
// export const dynamic = "force-dynamic";

// const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const { data } = await blogFetchers.fetchBlog({ blogId: slug });

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: "article",
      // images: details.images?.map((img) => `${siteUrl}/${img.url}`) || [], // Open Graph doesn’t support base64 data URIs.
    },
  };
}

export async function generateStaticParams() {
  const { data } = await blogFetchers.fetchBlogs();
  const blogData: Blog[] = data;
  return blogData.map((blog: any) => blog);
}

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const { data, message } = await blogFetchers.fetchBlog({ blogId: slug });

  const details: Blog = data;
  if (message === "Document not found") notFound();
  return <BlogDetails details={details} />;
}
