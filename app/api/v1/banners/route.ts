import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createBannerSchema, updateBannerSchema } from "./banners.validator";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";

// GET
export async function GET(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const userId = req.nextUrl.searchParams.get("userId");

    let bannersRef:any = db.collection("banners")
    if (userId) bannersRef = bannersRef.where("userId", "==", userId);
    // bannersRef = bannersRef.orderBy("createdAt", "desc");

    const bannersSnap = await bannersRef.get();
    const bannersData = bannersSnap.docs.map((doc:any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "banners found successfully",
        data: bannersData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

// CREATE
// export async function POST(req: NextRequest) {
//   try {
//     const decoded = await isAuthenticatedMiddleware(req);

//     const body = await req.json();
//     const value = validateMiddleware({ schema: createBannerSchema, body });

//     const createdBanner = {
//       ...value,
//       userId: decoded.uid,
//       author: decoded.email,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     const duplicateRef = db.collection("banners");
//     const duplicateSnap = await duplicateRef.where("userId", "==", decoded.uid).get();

//     if (!duplicateSnap.empty) throw createError("Banner already exists", 409);
//     const bannerRef = db.collection("banners");
//     const createdBannerRef = await bannerRef.add(createdBanner);

//     const bannerSnap = await createdBannerRef.get();
//     if (!bannerSnap.exists) throw createError("Banner not found", 404);

//     const banner = bannerSnap.data();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "banner created successfully",
//         data: banner,
//       },
//       { status: 201 },
//     );
//   } catch (err: any) {
//     return errorHandlerMiddleware(err);
//   }
// }
