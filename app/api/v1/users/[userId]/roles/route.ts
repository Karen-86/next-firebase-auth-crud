import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { updateUserRolesSchema } from "../../users.validator";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";
import isOwnerMiddleware from "@/lib/server/middlewares/authorization/isOwner.middleware";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { userData: user } = await loadUserMiddleware({ decoded });

    const body = await req.json();
    if (!body.roles) throw createError("Field roles is required", 400);

    const value = validateMiddleware({ schema: updateUserRolesSchema, body });
    const { userId } = await params;
    const {
      resourceRef: userRef,
      resourceSnap: userSnap,
      resourceData: foundUser,
    } = await loadResourceMiddleware({
      id: userId,
      documentName: "user",
      collectionName: "users",
    });

    const isAllowed = checkRoleHierarchyMiddleware({ user, foundUser });

    const updatedUser = {
      ...value,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await userRef.update(updatedUser);

    const updatedUserSnap = await userRef.get();
    const updatedUserData = updatedUserSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "user roles updated successfully",
        data: updatedUserData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
