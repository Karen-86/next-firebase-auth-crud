import React, { ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type ItemsProps = {
  trigger: string | ReactNode;
  content: string | ReactNode;
};

type AccordionDemoProps = {
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  items: ItemsProps[];
  type?: "single" | "multiple";
};

export function AccordionDemo({
  className = "",
  triggerClassName = "",
  contentClassName = "",
  itemClassName = "",
  items = [],
  type = "single",
}: AccordionDemoProps) {
  /* for multiple type remove collapsible attribute*/
  return (
    <Accordion  type={type} {...(type === "single" ? { collapsible: true } : {})} className={`accordion-demo ${className}`}>
      {items.map((item:any, index) => {
        return (
          <AccordionItem className={`${itemClassName} `} value={`item-${uuidv4()}`} key={index}>
            <AccordionTrigger className={`${triggerClassName} cursor-pointer`}>{item.trigger}</AccordionTrigger>
            <AccordionContent className={contentClassName}>{item.content}</AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

// CUSTOM PlusIcon MinusIcon version

// 'use client'

// import React, { useState, ReactNode } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { PlusIcon, MinusIcon } from "lucide-react";

// type ItemsProps = {
//   trigger: string;
//   content: string | ReactNode;
// };

// type AccordionDemoProps = {
//   className?: string;
//   triggerClassName?: string;
//   items: ItemsProps[];
//   type?: "single" | "multiple";
// };

// export function AccordionDemo({ className = "", triggerClassName = "", items = [], type = "single" }: AccordionDemoProps) {
//   const [openItem, setOpenItem] = useState<string | undefined>(undefined);

//   return (
//     <Accordion
//       type="single"
//       {...(type === "single" ? { collapsible: true } : {})}
//       className={`accordion-demo ${className}`}
//       value={openItem}
//       onValueChange={setOpenItem}
//     >
//       {items.map((item, index) => {
//         const value = `item-${index}`;
//         const isOpen = openItem === value;
//         return (
//           <AccordionItem value={value} key={index}>
//             <AccordionTrigger className={triggerClassName}>
//               {item.trigger}
//               <span className="">{isOpen ? <MinusIcon /> : <PlusIcon />}</span>
//             </AccordionTrigger>
//             <AccordionContent>{item.content}</AccordionContent>
//           </AccordionItem>
//         );
//       })}
//     </Accordion>
//   );
// }
