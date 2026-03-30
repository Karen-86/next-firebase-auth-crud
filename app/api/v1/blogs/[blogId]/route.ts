import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase/config/firebaseAdmin"
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware"
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware"
import createError from "@/lib/utils/createError"
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware"
import admin from "firebase-admin"
import validateMiddleware from "@/lib/server/middlewares/validate.middleware"
import { createBlogSchema, updateBlogSchema } from "../blogs.validator"
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware"
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware"
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware"
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware"

export async function GET(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    // const decoded = await isAuthenticatedMiddleware(req);

    const { blogId } = await params
    const { blog } = await loadResourceMiddleware({
      id: blogId,
      reqKey: "blog",
      collectionName: "blogs",
    })

    return NextResponse.json(
      {
        success: true,
        message: "blog found successfully",
        data: blog,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req)

    const body = await req.json()
    const value = validateMiddleware({ schema: createBlogSchema, body })

    const { userData } = await loadUserMiddleware({ decoded })

    const user = userData
    const blogsRef = db.collection("blogs")

    const { blogId } = await params
    if (!blogId) throw createError("Invalid ID", 400)

    const { id } = await db.runTransaction(async (transaction) => {
      const query = blogsRef.where("userId", "==", user.id).limit(10)
      const snapshot = await transaction.get(query)

      if (snapshot.size >= 10) throw createError("Blog creation limit per user exceeded", 403)

      const newBlogRef = blogsRef.doc(blogId)
      const newBlogSnap = await transaction.get(newBlogRef)

      if (newBlogSnap.exists) throw createError("Blog with this ID already exists", 409)

      transaction.set(newBlogRef, {
        ...value,
        userId: user.id,
        author: decoded.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      return { id: newBlogRef.id }
    })

    const createdBlogSnap = await blogsRef.doc(id).get()
    const createdBlogData = {
      id: createdBlogSnap.id,
      ...createdBlogSnap.data(),
    }

    return NextResponse.json(
      {
        success: true,
        message: "blog created successfully",
        data: createdBlogData,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}

// with auto generated ID
// export async function POST(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
//   try {
//     const decoded = await isAuthenticatedMiddleware(req)

//     const body = await req.json()
//     const value = validateMiddleware({ schema: createBlogSchema, body })

//      const { userData } = await loadUserMiddleware({ decoded });

//     const user = userData
//     const blogsRef = db.collection("blogs")

//    const {id} = await db.runTransaction(async (transaction) => {
//       const query = blogsRef.where("userId", "==", user.id).limit(10)
//       const snapshot = await transaction.get(query)

//       if (snapshot.size >= 10) throw createError("Blog creation limit per user exceeded", 403)

//       const newBlogRef = blogsRef.doc() // no param = auto-ID
//       const newBlogSnap = await transaction.get(newBlogRef)

//       if (newBlogSnap.exists) throw createError("Blog with this ID already exists", 409)

//       transaction.set(newBlogRef, {
//         ...value,
//         userId: user.id,
//         author: decoded.email,
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       })

//       return { id: newBlogRef.id };
//     })

//     const createdBlogSnap = await blogsRef.doc(id).get()
//     const createdBlogData = {
//       id: createdBlogSnap.id,
//       ...createdBlogSnap.data(),
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "blog created successfully",
//         data: createdBlogData,
//       },
//       { status: 201 }
//     )
//   } catch (err: any) {
//     return errorHandlerMiddleware(err)
//   }
// }

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req)

    const body = await req.json()
    const value = validateMiddleware({ schema: updateBlogSchema, body })

    const { blogId } = await params
    const { blogRef, blog } = await loadResourceMiddleware({
      id: blogId,
      reqKey: "blog",
      collectionName: "blogs",
    })

    const isAllowed = isResourceOwnerMiddleware({ actingUser: decoded, resource: blog })

    const fields = value

    const updatedBlog = { ...fields, updatedAt: admin.firestore.FieldValue.serverTimestamp() }

    await blogRef.update(updatedBlog)

    const updatedBlogSnap = await blogRef.get()
    const updatedBlogData = { id: updatedBlogSnap.id, ...updatedBlogSnap.data() }

    return NextResponse.json(
      {
        success: true,
        message: "blog updated successfully",
        data: updatedBlogData,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ blogId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req)
    const { userData: user } = await loadUserMiddleware({ decoded })

    const { blogId } = await params
    const {  blogRef, blog } = await loadResourceMiddleware({
      id: blogId,
      reqKey: "blog",
      collectionName: "blogs",
    })

    const {  foundUser } = await loadResourceMiddleware({
      id: blog.userId,
      reqKey: "foundUser",
      collectionName: "users",
      ignoreNotFound: true,
    })

    const isAllowed = checkRoleHierarchyMiddleware({
      user,
      foundUser,
      allowOwner: true,
      ignoreTargetUserNotFound: true,
    })

    await blogRef.delete()

    return NextResponse.json(
      {
        success: true,
        message: "blog deleted successfully",
        data: blog,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}
