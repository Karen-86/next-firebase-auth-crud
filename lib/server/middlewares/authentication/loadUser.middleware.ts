import { db } from "@/lib/firebase/config/firebaseAdmin";
import createError from "@/lib/utils/createError";

const loadUser = async ({ decoded = {} }: { decoded: any }) => {
  const userRef = db.collection("users").doc(decoded.uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) throw createError("Session expired or user no longer exists", 401);
  const userData = { id: userSnap.id, ...userSnap.data() };

  const req:any = {
    userRef,
    userSnap,
    userData,
  };
  return req;
};

export default loadUser;
