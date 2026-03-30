import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase/config/firebaseAdmin"
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware"
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware"
import createError from "@/lib/utils/createError"
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware"
import admin from "firebase-admin"
import validateMiddleware from "@/lib/server/middlewares/validate.middleware"
import { createBannerSchema, updateBannerSchema } from "./banners.validator"
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware"
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware"
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware"
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware"

// GET
export async function GET(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req)

    const bannersRef = db.collection("banners")
    const bannersSnap = await bannersRef.get()
    const bannersData = bannersSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))

    return NextResponse.json(
      {
        success: true,
        message: "banners found successfully",
        data: bannersData,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}

// CREATE
export async function POST(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req)

    const body = await req.json()
    const value = validateMiddleware({ schema: createBannerSchema, body })

    const { userData } = await loadUserMiddleware({ decoded })

    const user = userData
    const fields = value

    const bannersRef = db.collection("banners")
    const newBannerRef = bannersRef.doc(user.id)

    await newBannerRef.create({
      ...fields,
      userId: user.id,
      author: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    const createdBannerSnap = await bannersRef.doc(user.id).get()
    const createdBannerData = { id: createdBannerSnap.id, ...createdBannerSnap.data() }

    return NextResponse.json(
      {
        success: true,
        message: "banner created successfully",
        data: createdBannerData,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}
