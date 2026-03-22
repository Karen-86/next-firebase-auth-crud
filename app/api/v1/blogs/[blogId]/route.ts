import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createBlogSchema, updateBlogSchema } from "../blogs.validator";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { blogId } = await params;
    const { resourceData: blogData } = await loadResourceMiddleware({
      id: blogId,
      documentName: "blog",
      collectionName: "blogs",
    });

    return NextResponse.json(
      {
        success: true,
        message: "blog found successfully",
        data: blogData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { blogId } = await params;
    if (!blogId) throw createError("Invalid ID", 400);

    const body = await req.json();
    const value = validateMiddleware({ schema: createBlogSchema, body });

    const createdBlog = {
      ...value,
      userId: decoded.uid,
      author: decoded.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const blogRef = db.collection("blogs").doc(blogId);

    // if using set or add they require a duplicate check statement because they dont throw duplicate errors
    // const duplicateSnap = await blogRef.get()
    // if (duplicateSnap.exists) throw createError("Blog already exists", 409);
    // await blogRef.set(createdBlog);
    
    await blogRef.create(createdBlog);

    const blogSnap = await blogRef.get();
    if (!blogSnap.exists) throw createError("Blog not found", 404);

    const blog = blogSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "blog created successfully",
        data: blog,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();
    const value = validateMiddleware({ schema: updateBlogSchema, body });

    const { blogId } = await params;
    const {
      resourceRef: blogRef,
      resourceSnap: blogSnap,
      resourceData: blogData,
    } = await loadResourceMiddleware({
      id: blogId,
      documentName: "blog",
      collectionName: "blogs",
    });

    const isAllowed = isResourceOwnerMiddleware({ actingUser: decoded, resource: blogData });

    const updatedBlog = {
      ...value,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await blogRef.update(updatedBlog);

    const updatedBlogSnap = await blogRef.get();
    const blog = updatedBlogSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "blog updated successfully",
        data: blog,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { blogId } = await params;
    const { resourceRef: blogRef, resourceData: blogData } = await loadResourceMiddleware({
      id: blogId,
      documentName: "blog",
      collectionName: "blogs",
    });

    const { userData: user } = await loadUserMiddleware({ decoded });
    const { resourceData: foundUser } = await loadResourceMiddleware({
      id: blogData.userId,
      documentName: "user",
      collectionName: "users",
      ignoreNotFound: true,
    });


    const isAllowed = checkRoleHierarchyMiddleware({
      user,
      foundUser,
      allowOwner: true,
      ignoreTargetUserNotFound: true,
    });

    await blogRef.delete();

    return NextResponse.json(
      {
        success: true,
        message: "blog deleted successfully",
        data: blogData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
