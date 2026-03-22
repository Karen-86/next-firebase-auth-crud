"use client";

import React, { useEffect, useState } from "react";
import {LOCAL_DATA} from "@/constants/index";
import Link from "next/link";

const { preloaderImage, placeholderImage } = LOCAL_DATA.images;

const BlogCard = ({ image = "", title = "", description = "", slug = "" }) => {
  const [src, setSrc] = useState<any>(null);

  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => setSrc(image);
    img.onerror = () => setSrc(placeholderImage);
  }, [image]);

  return (
    <Link href={`blogs/${slug}`} className="card blog-card">
      <div className="card-header mb-2">
        <div className="img-wrapper rounded-sm overflow-hidden relative pt-[56.25%] h-0">
          {src ? (
            <img
              className="absolute object-cover top-0 left-0 w-full h-full"
              onError={() => setSrc(placeholderImage)}
              src={src}
              alt={title}
            />
          ) : (
            <img className="absolute object-contain top-[50%] left-[50%] transform-[translate(-50%,-50%)] w-5 h-5" src={preloaderImage} />
          )}
        </div>
      </div>
      <div className="card-body">
        <h4 className="text-lg font-medium! leading-[1.3] mb-[0.7rem]">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
