"use client";
// import "@/components/blocks/editor-x/editor.css";

import React, { useEffect, useState, useRef } from "react";
import { BlogCard, LoadingScreen, BreadcrumbDemo, ButtonDemo } from "@/components/index.js";
import Link from "next/link";
import { CornerUpLeftIcon } from "lucide-react";
import {LOCAL_DATA} from "@/constants/index";
import Image from "next/image";
import { Blog } from "@/modules/blogs/types";

const { preloaderImage, placeholderImage } = LOCAL_DATA.images;

export default function BlogDetails({ details }: { details: Blog }) {
  const breadcrumbItems = [
    {
      href: "/blogs",
      label: "Blogs",
    },
    {
      label: `${details?.title}`,
    },
  ];

  return (
    <main id="blog-details-page">
      <div className="flex items-center gap-2 mb-3">
        <Link href="/blogs">
          <ButtonDemo variant="ghost" icon={<CornerUpLeftIcon />} size="icon" />
        </Link>

        <BreadcrumbDemo items={breadcrumbItems} />
      </div>

      {!Object.keys(details).length ? (
        <h2 className="text-3xl text-gray-300">Empty</h2>
      ) : (
        <DetailsSection {...{ ...details, image: details.images && details?.images[0].url }} />
      )}
    </main>
  );
}

const DetailsSection = ({ image = "", title = "", description = "", content = "" }) => {
  const [src, setSrc] = useState<any>(null);
  useEffect(() => {
    if (!image) return;
    const img = new window.Image() as HTMLImageElement;
    img.src = image;
    img.onload = () => setSrc(image);
    img.onerror = () => setSrc(placeholderImage);
  }, [image]);

  return (
    <section className="details p-0!">
      <article className="details-content">
        <div className="relative pt-[56.25%]">
          {src ? (
            <Image src={src} alt={title} fill />
          ) : (
            <img
              className="absolute object-contain top-[50%] left-[50%] transform-[translate(-50%,-50%)] w-20 h-20"
              src={preloaderImage}
            />
          )}
        </div>
        <br />
        {title && <h1 className="text-3xl mb-4">{title}</h1>}
        {description && <p className=" text-gray-500">{description}</p>}
        <br />
        <br />

        <div className="" dangerouslySetInnerHTML={{ __html: content }}></div>
      </article>
    </section>
  );
};
