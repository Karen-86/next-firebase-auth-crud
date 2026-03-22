import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createPageSchema, updatePageSchema } from "../pages.validator";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ pageId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { pageId } = await params;
    const { resourceData: pageData } = await loadResourceMiddleware({
      id: pageId,
      documentName: "page",
      collectionName: "pages",
    });

    return NextResponse.json(
      {
        success: true,
        message: "page found successfully",
        data: pageData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ pageId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { pageId } = await params;
    if (!pageId) throw createError("Invalid ID", 400);

    const body = await req.json();
    const value = validateMiddleware({ schema: createPageSchema, body });

    const { userData: user } = await loadUserMiddleware({ decoded });
    const isAllowed = allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

    const createdPage = {
      ...value,
      userId: decoded.uid,
      author: decoded.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const pageRef = db.collection("pages").doc(pageId);
    await pageRef.set(createdPage);

    const pageSnap = await pageRef.get();
    if (!pageSnap.exists) throw createError("Page not found", 404);

    const page = pageSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "page created successfully",
        data: page,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ pageId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();
    const value = validateMiddleware({ schema: updatePageSchema, body });

    const { userData: user } = await loadUserMiddleware({ decoded });
    const isAllowed = allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

    const { pageId } = await params;
    const { resourceRef: pageRef } = await loadResourceMiddleware({
      id: pageId,
      documentName: "page",
      collectionName: "pages",
    });

    const updatedPage = {
      ...value,
      userId: decoded.uid,
      author: decoded.email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await pageRef.update(updatedPage);

    const updatedPageSnap = await pageRef.get();
    const page = updatedPageSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "page updated successfully",
        data: page,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
