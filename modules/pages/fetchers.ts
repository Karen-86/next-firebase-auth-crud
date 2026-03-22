import { doc, getDoc, getDocs, collection, query, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config/firebaseClient";
// import { notFound } from "next/navigation";

export async function fetchPage({ pageId = "" }) {
  try {
    const pagesRef = collection(db, "pages");
    const pageRef = doc(pagesRef, pageId);
    const pageSnap = await getDoc(pageRef);

    // if (!pageSnap.exists()) throw new Error("Document not found");
    if (!pageSnap.exists()) console.warn(new Error("Document not found"));

    const data: any = { id: pageSnap.id, ...pageSnap.data() };
    const { createdAt, updatedAt, ...rest } = data;

    return { success: true, message: "success", data: rest };
  } catch (err: any) {
    console.error("=fetchPage= error:", err);
    return { success: false, message: err.message, data: {} };
  }
}
