'use client'

import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {LOCAL_DATA} from "@/constants/index";
import { ButtonDemo } from "@/components/index";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { penIcon } = LOCAL_DATA.svgs;
// const invoices = [
//   {
//     invoice: "INV001",
//     paymentStatus: "Paid",
//     totalAmount: "$250.00",
//     paymentMethod: "Credit Card",
//   },
//   {
//     invoice: "INV002",
//     paymentStatus: "Pending",
//     totalAmount: "$150.00",
//     paymentMethod: "PayPal",
//   },
//   {
//     invoice: "INV003",
//     paymentStatus: "Unpaid",
//     totalAmount: "$350.00",
//     paymentMethod: "Bank Transfer",
//   },
//   {
//     invoice: "INV004",
//     paymentStatus: "Paid",
//     totalAmount: "$450.00",
//     paymentMethod: "Credit Card",
//   },
//   {
//     invoice: "INV005",
//     paymentStatus: "Paid",
//     totalAmount: "$550.00",
//     paymentMethod: "PayPal",
//   },
//   {
//     invoice: "INV006",
//     paymentStatus: "Pending",
//     totalAmount: "$200.00",
//     paymentMethod: "Bank Transfer",
//   },
//   {
//     invoice: "INV007",
//     paymentStatus: "Unpaid",
//     totalAmount: "$300.00",
//     paymentMethod: "Credit Card",
//   },
// ]

type InvoicesProps = {
  invoices: {
    invoice: string ;
    name: string | React.ReactNode;
    href: string ;
    isDisabled?: boolean;
  }[];
};

export function TableDemo({ invoices = [] }: InvoicesProps) {
  const router = useRouter();
  return (
    <div className="rounded-md  overflow-hidden">
      <Table className="">
        {/* <TableCaption className="mb-5">A list of your recent invoices.</TableCaption> */}
        <TableHeader className="">
          <TableRow className=" hover:bg-current-color">
            <TableHead className="px-5 py-2.5 w-[100px] ">#</TableHead>
            <TableHead className="px-5 py-2.5 ">Name</TableHead>
            <TableHead className="px-5 py-2.5 text-right ">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow
              onClick={() => {
                if (!invoice.isDisabled) router.push(invoice.href);
              }}
              key={invoice.invoice}
              className={` ${invoice.isDisabled ? "opacity-20 pointer-events-none" : ""} cursor-pointer group`}
            >
              <TableCell className="font-medium px-5 py-2.5">{invoice.invoice}</TableCell>
              <TableCell className=" px-5 py-2.5">
                <div className=" group-hover:underline">

                {invoice.name}
                </div>
              </TableCell>
              <TableCell className="text-right px-5">
                <ButtonDemo icon={penIcon} variant="ghost" size="icon" className="h-auto w-auto pointer-events-none" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-current-color">
            <TableCell colSpan={4} className="text-center px-3 py-2.5">
              A list of your sections.
            </TableCell>
            {/* <TableCell colSpan={3}>Total</TableCell> */}
            {/* <TableCell className="text-right">$2,500.00</TableCell> */}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
