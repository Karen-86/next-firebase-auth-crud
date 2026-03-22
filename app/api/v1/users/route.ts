import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";

export async function GET(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const usersRef = db.collection("users").orderBy("createdAt", "desc");
    const usersSnap = await usersRef.get();

    const users = usersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "users found successfully",
        data: users,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
