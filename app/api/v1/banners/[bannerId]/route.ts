import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createBannerSchema, updateBannerSchema } from "../banners.validator";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";

// UPDATE
// export async function PATCH(req: NextRequest, { params }: { params: Promise<{ bannerId: string }> }) {
//   try {
//     const decoded = await isAuthenticatedMiddleware(req);

//     const body = await req.json();
//     const value = validateMiddleware({ schema: updateBannerSchema, body });

//     const { bannerId } = await params;
//     const {
//       resourceRef: bannerRef,
//       resourceSnap: bannerSnap,
//       resourceData: bannerData,
//     } = await loadResourceMiddleware({
//       id: bannerId,
//       documentName: "banner",
//       collectionName: "banners",
//     });

//     const isAllowed = isResourceOwnerMiddleware({ actingUser: decoded, resource: bannerData });

//     const updatedBanner = {
//       ...value,
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     };
//     await bannerRef.update(updatedBanner);

//     const updatedBannerSnap = await bannerRef.get();
//     const banner = updatedBannerSnap.data();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "banner updated successfully",
//         data: banner,
//       },
//       { status: 200 },
//     );
//   } catch (err: any) {
//     return errorHandlerMiddleware(err);
//   }
// }

// UPSERT
export async function PATCH(req: NextRequest, { params }: {params: Promise<{ bannerId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();
    const value = validateMiddleware({ schema: updateBannerSchema, body });

    const { bannerId } = await params;
    const bannerRef = db.collection("banners").doc(bannerId);
    const bannerSnap = await bannerRef.get();
    const bannerData = bannerSnap.data();

    // check ownership if banner exists
    if (bannerSnap.exists && !isResourceOwnerMiddleware({ actingUser: decoded, resource: bannerData }))
      throw createError("Not allowed to update this banner", 403);

    const updatedBanner: any = {
      ...value,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!bannerSnap.exists) {
      updatedBanner.userId = decoded.uid;
      updatedBanner.author = decoded.email;
      updatedBanner.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await bannerRef.set(updatedBanner, { merge: true });

    const updatedBannerSnap = await bannerRef.get();
    const banner = updatedBannerSnap.data();

    return NextResponse.json({ success: true, message: "Banner updated successfully", data: banner }, { status: 200 });
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
