"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Header, Footer, ButtonDemo } from "@/components/index";
import {LOCAL_DATA} from "@/constants/index";
import { ChevronLeft } from "lucide-react";

const { notFoundImage } = LOCAL_DATA.images;

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="">
      {/* <Header className="static" /> */}
      <main className="">
        <section className="min-h-screen flex items-center">
          <div className="container text-center">
            <h1 className="text-6xl mb-8 uppercase">404</h1>
            <br />
            <img src={notFoundImage} className="w-full max-w-112.5 mx-auto mb-12" />
            <ButtonDemo
              startIcon={<ChevronLeft className="-ml-3" />}
              text="Back"
              className="min-w-25"
              onClick={() => router.back()}
            />
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
