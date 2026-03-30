import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createSectionSchema, updateSectionSchema } from "../sections.validator";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ sectionId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { sectionId } = await params;
    const {  section } = await loadResourceMiddleware({
      id: sectionId,
      reqKey: "section",
      collectionName: "sections",
    });

    return NextResponse.json(
      {
        success: true,
        message: "section found successfully",
        data: section,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ sectionId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { sectionId } = await params;
    if (!sectionId) throw createError("Invalid ID", 400);

    const body = await req.json();
    const value = validateMiddleware({ schema: createSectionSchema, body });

        const { userData: user } = await loadUserMiddleware({ decoded });
    const isAllowed = allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

    const createdSection = {
      ...value,
      userId: decoded.uid,
      author: decoded.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const sectionRef = db.collection("sections").doc(sectionId);
    await sectionRef.set(createdSection);

    const sectionSnap = await sectionRef.get();
    if (!sectionSnap.exists) throw createError("Section not found", 404);

    const section = sectionSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "section created successfully",
        data: section,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ sectionId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();
    const value = validateMiddleware({ schema: updateSectionSchema, body });

    const { userData: user } = await loadUserMiddleware({ decoded });
    const isAllowed = allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });
    
    const { sectionId } = await params;
    const { sectionRef } = await loadResourceMiddleware({
      id: sectionId,
      reqKey: "section",
      collectionName: "sections",
    });

    const updatedSection = {
      ...value,
      userId: decoded.uid,
      author: decoded.email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await sectionRef.update(updatedSection);

    const updatedSectionSnap = await sectionRef.get();
    const section = updatedSectionSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "section updated successfully",
        data: section,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
