import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { updateUserSchema } from "../users.validator";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";
import isOwnerMiddleware from "@/lib/server/middlewares/authorization/isOwner.middleware";
import { adminAuth } from "@/lib/firebase/config/firebaseAdmin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { userId } = await params;
    const { resourceData: userData } = await loadResourceMiddleware({
      id: userId,
      documentName: "user",
      collectionName: "users",
    });

    return NextResponse.json(
      {
        success: true,
        message: "user found successfully",
        data: userData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();
    const value = validateMiddleware({ schema: updateUserSchema, body });

    const { userId } = await params;
    const {
      resourceRef: userRef,
      resourceSnap: userSnap,
      resourceData: userData,
    } = await loadResourceMiddleware({
      id: userId,
      documentName: "user",
      collectionName: "users",
    });

    const isAllowed = isOwnerMiddleware({ actingUser: decoded, targetUser: userData });

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
        message: "user updated successfully",
        data: updatedUserData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    // get user
    const { userData: user } = await loadUserMiddleware({ decoded });

    // get foundUser
    const { userId } = await params;
    const { resourceRef: userRef, resourceData: foundUser } = await loadResourceMiddleware({
      id: userId,
      documentName: "user",
      collectionName: "users",
    });

    // get banner
    const bannersRef = db.collection("banners");
    const bannersSnap = await bannersRef.where("userId", "==", userId).get();


    const isAllowed = checkRoleHierarchyMiddleware({
      user,
      foundUser,
      allowOwner: true,
    });

    await Promise.all(bannersSnap.docs.map((doc) => doc.ref.delete()));
    await userRef.delete();
    await adminAuth.deleteUser(foundUser.uid);

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        data: foundUser,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
