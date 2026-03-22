import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";

export async function GET(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const blogsRef = db.collection("blogs").orderBy("createdAt", "desc");
    const blogsSnap = await blogsRef.get();

    const blogs = blogsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "blogs found successfully",
        data: blogs,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
