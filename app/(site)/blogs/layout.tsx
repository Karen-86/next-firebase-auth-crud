// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Centralized Management Panel",
// };

"use client";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-[110px] pb-[150px]  min-h-screen">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-y-20 gap-x-15">
          <div className="flex-1">{children}</div>

          <aside className="sidebar min-w-[250px]">
            <h2 className="text-1xl mb-8 font-medium! uppercase w-fit mx-auto">
              <div className="pb-2">From the blog</div>
              <div className="line w-[70%] h-[3px] bg-black mx-auto"></div>
            </h2>
            <h5 className="bg-black text-white px-2 py-1 font-medium! mb-3">Categories</h5>
            <ul>
              <li className="text-sm text-gray-500 mb-2">Lifestyle (1)</li>
              <li className="text-sm text-gray-500 mb-2">Company News (1)</li>
              <li className="text-sm text-gray-500 mb-2">Social Media (1)</li>
              <li className="text-sm text-gray-500 mb-2">Lifestyle (1)</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
