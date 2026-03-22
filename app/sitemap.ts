import * as blogFetchers from "@/modules/blogs/fetchers"
import { Blog } from "@/modules/blogs/types";
import { MetadataRoute } from "next";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await blogFetchers.fetchBlogs();
  const blogList: Blog[] = data;
  const blogEntries: MetadataRoute.Sitemap = blogList.map((blog: any) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
  }));

  return [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
    },
    ...blogEntries,
  ];
}
