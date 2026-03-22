// "use client";
// import React, { useState, useEffect } from "react";

// import { BadgeCheck, Bell, ChevronDown, CreditCard, LogOut, Sparkles } from "lucide-react";
// import { useAuthContext } from "@/context/api/AuthContext";
// import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
// import Link from "next/link";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ModeToggle } from "@/components/index";

// import {LOCAL_DATA} from "@/constants/index";

// const { avatarPlaceholderImage, ellipsisPreloaderImage } = LOCAL_DATA.images;

// const NavUser = () => {
//   const { handleSignOut, currentUser } = useAuthContext();
//   const { fetchedCurrentUser } = useFirebaseApiContext();
//   const { details } = fetchedCurrentUser;
//   const [user, setUser] = useState<any>({
//     name: "",
//     email: "",
//     photoURL: null,
//     base64PhotoURL: null,
//   });
//   // const user = {
//   //   name: details?.displayName || "",
//   //   email: details?.email || "",
//   //   photoURL: details?.photoURL || null,
//   //   base64PhotoURL: details?.base64PhotoURL || null,
//   // };

//   useEffect(() => {
//     setUser({
//       name: details?.displayName || "",
//       email: details?.email || "",
//       photoURL: details?.photoURL || null,
//       base64PhotoURL: details?.base64PhotoURL || null,
//     });
//   }, [details]);

//   return (
//     <DropdownMenu modal={false}>
//       <DropdownMenuTrigger className="flex gap-2 items-center outline-none cursor-pointer dark:hover:bg-secondary hover:bg-gray-50 px-2 py-1 rounded-sm">
//         <Avatar className="h-8 w-8 rounded-full border">
//           <AvatarImage src={user.base64PhotoURL || user.photoURL} alt={user.name} />
//           <AvatarFallback className="rounded-full">
//             <img src={avatarPlaceholderImage} alt="" />
//           </AvatarFallback>
//         </Avatar>
//         <div className="grid flex-1 text-left text-sm leading-tight">
//           {user.name ? (
//             <>
//               <span className="truncate font-semibold">{user.name}</span>
//               <span className="truncate text-xs">{user.email}</span>
//             </>
//           ) : (
//             <img className="max-w-[45px]" src={ellipsisPreloaderImage} alt="" />
//           )}
//         </div>
//         <ChevronDown className="ml-auto size-4" />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//         side={"bottom"}
//         align="end"
//         sideOffset={4}
//       >
//         <DropdownMenuLabel className="p-0 font-normal">
//           <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//             <Avatar className="h-8 w-8 rounded-full">
//               <AvatarImage src={user.base64PhotoURL || user.photoURL} alt={user.name} />
//               <AvatarFallback className="rounded-full">
//                 <img src={avatarPlaceholderImage} alt="" />
//               </AvatarFallback>
//             </Avatar>
//             <div className="grid flex-1 text-left text-sm leading-tight">
//               <span className="truncate font-semibold">{user.name}</span>
//               <span className="truncate text-xs">{user.email}</span>
//             </div>
//           </div>
//         </DropdownMenuLabel>
//         {/* <DropdownMenuSeparator /> */}
//         {/* <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <Sparkles />
//             Upgrade to Pro
//           </DropdownMenuItem>
//         </DropdownMenuGroup> */}
//         {/* <DropdownMenuSeparator /> */}
//         {/* <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <BadgeCheck />
//             Account
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <CreditCard />
//             Billing
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Bell />
//             Notifications
//           </DropdownMenuItem>
//         </DropdownMenuGroup> */}
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild className="cursor-pointer">
//           <Link className="" href="/dashboard/my-profile">
//             My Profile
//           </Link>
//         </DropdownMenuItem>
     
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>
//           light/dark toggler <ModeToggle />
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
//           <LogOut />
//           Log out
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// export default NavUser;
