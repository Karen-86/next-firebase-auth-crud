import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import admin from "firebase-admin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
// import { createBlogSchema, updateBlogSchema } from "../blogs.validator";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";

export async function PATCH(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { userRef } = await loadUserMiddleware({ decoded });

    const updatedUser = { email: decoded.email, updatedAt: admin.firestore.FieldValue.serverTimestamp() };

    await userRef.set(updatedUser, { merge: true });

    const userSnap = await userRef.get();
    if (!userSnap.exists) throw createError("User not found", 404);

    const user = userSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "User email updated successfully",
        data: user,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
