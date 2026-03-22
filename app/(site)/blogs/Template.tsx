"use client";

import { BlogCard } from "@/components/index.js";
import { Blog } from "@/modules/blogs/types";

type Props = {
  blogData: Blog[];
};

export default function Template({ blogData }: Props) {
  return (
    <main className="blog-page">
      <HeroSection blogData={blogData} />
    </main>
  );
}

const HeroSection = ({ blogData }: Props) => {
  return (
    <section className="hero p-0!" id="blog-page">
      <h2 className="text-1xl mb-8 font-medium! uppercase w-fit mx-auto">
        <div className="pb-2">From the blog</div>
        <div className="line w-[70%] h-[3px] bg-black mx-auto"></div>
      </h2>
      <div className="blog-list grid md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
        {blogData.length ? (
          blogData.map((blogItem: any, index: any) => {
            return (
              <BlogCard
                key={index}
                {...{ ...blogItem, description: blogItem.shortDescription, image: blogItem.images[0].url }}
              />
            );
          })
        ) : (
          <h2 className="text-3xl text-gray-300">Empty</h2>
        )}
      </div>
    </section>
  );
};
