import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase/config/firebaseAdmin"
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware"
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware"
import createError from "@/lib/utils/createError"
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware"
import admin from "firebase-admin"
import validateMiddleware from "@/lib/server/middlewares/validate.middleware"
import { createBannerSchema, updateBannerSchema } from "../banners.validator"
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware"
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware"
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware"
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware"

export async function GET(req: NextRequest, { params }: { params: Promise<{ bannerId: string }> }) {
  try {
    // const decoded = await isAuthenticatedMiddleware(req);

    const { bannerId } = await params
    const { banner } = await loadResourceMiddleware({
      id: bannerId,
      reqKey: "banner",
      collectionName: "banners",
      ignoreNotFound: true,
    })

    return NextResponse.json(
      {
        success: true,
        message: "banner found successfully",
        data: banner,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}

// UPDATE
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ bannerId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req)

    const body = await req.json()
    const value = validateMiddleware({ schema: updateBannerSchema, body })

    const { bannerId } = await params
    const { bannerRef, banner } = await loadResourceMiddleware({
      id: bannerId,
      reqKey: "banner",
      collectionName: "banners",
    })

    const isAllowed = isResourceOwnerMiddleware({ actingUser: decoded, resource: banner })

    const fields = value

    const updatedBanner = {
      ...fields,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    await bannerRef.update(updatedBanner)

    const updatedBannerSnap = await bannerRef.get()
    const updatedBannerData = { id: updatedBannerSnap.id, ...updatedBannerSnap.data() }

    return NextResponse.json(
      {
        success: true,
        message: "banner updated successfully",
        data: updatedBannerData,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}
