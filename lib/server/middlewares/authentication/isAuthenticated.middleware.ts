import { NextRequest, NextResponse } from "next/server";
import createError from "@/lib/utils/createError.js";
import { adminAuth } from "@/lib/firebase/config/firebaseAdmin";

const isAuthenticated = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) throw createError("Unauthorized", 401);

  return await adminAuth.verifyIdToken(token);
};

export default isAuthenticated;
