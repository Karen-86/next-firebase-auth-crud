import { doc, getDoc, getDocs, collection, query, orderBy } from "firebase/firestore"
import { db, auth } from "@/lib/firebase/config/firebaseClient"
// import { notFound } from "next/navigation";

export async function fetchSection({ sectionId = "" }) {
  try {
    if (!sectionId) throw new Error("Invalid ID")

    const sectionsRef = collection(db, "sections")
    const sectionRef = doc(sectionsRef, sectionId)
    const sectionSnap = await getDoc(sectionRef)

    // if (!sectionSnap.exists()) throw new Error("Document not found");
    if (!sectionSnap.exists()) console.warn(new Error("Document not found"))

    const data: any = { id: sectionSnap.id, ...sectionSnap.data() }
    const { createdAt, updatedAt, ...rest } = data

    return { success: true, message: "success", data: rest }
  } catch (err: any) {
    console.error("=fetchSection= error:", err)
    return { success: false, message: err.message, data: {} }
  }
}
