import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";


export async function GET(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const url = req.nextUrl
    const userId = url.searchParams.get("userId")
    const limit = url.searchParams.get("limit")
    const sort = url.searchParams.get("sort")
    const order = url.searchParams.get("order")

    let blogsRef: FirebaseFirestore.Query = db.collection("blogs")

    if (userId)   blogsRef = blogsRef.where("userId", "==", userId)

    if (sort) {
      const safeOrder = order === "asc" ? "asc" : "desc" // default to desc if sort is provided
      blogsRef = blogsRef.orderBy(sort, safeOrder)
    }

    if (limit) {
      const safeLimit = Math.min(Number(limit), 50) // max 50
      blogsRef = blogsRef.limit(safeLimit)
    }

    const blogsSnap = await blogsRef.get()
    const blogsData = blogsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(
      {
        success: true,
        message: "blogs found successfully",
        data: blogsData,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}