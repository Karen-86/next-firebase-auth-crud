// "use server";
// import { adminAuth } from "@/lib/firebase/config/firebaseAdmin";
// import { getFirestore } from "firebase-admin/firestore";

// const db = getFirestore();

// export const deleteUser = async (idToken: string, uid: string) => {
//   try {
//     // 1️ Verify ID token
//     const decoded = await adminAuth.verifyIdToken(idToken);
//     const requesterUid = decoded.uid;

//     // 2️ Get requester's role from Firestore
//     const requesterDoc = await db.collection("users").doc(requesterUid).get();
//     const requesterRole = requesterDoc.exists ? requesterDoc.data()?.role : null;

//     // 3️ Get target user's role
//     const targetDoc = await db.collection("users").doc(uid).get();
//     const targetRole = targetDoc.exists ? targetDoc.data()?.role : null;

//     // 4️ Determine permissions
//     const isSelf = requesterUid === uid;
//     const canDelete =
//       isSelf || // user can delete own account
//       requesterRole === "superAdmin" || // superAdmin can delete anyone
//       (requesterRole === "admin" && targetRole === "user"); // admin can delete only normal users

//     if (!canDelete) {
//       return { success: false, error: "Unauthorized attempt" };
//     }

//     // 5️ Delete Auth user
//     await adminAuth.deleteUser(uid);

//     // 6️ Delete Firestore user document
//     //   await db.collection("users").doc(uid).delete();
//     await deleteDocumentRecursively(db.collection("users").doc(uid));

//     return { success: true };
//   } catch (err: any) {
//     console.error("Error deleting user:", err);
//     return { success: false, error: err.message };
//   }
// };

// export async function deleteDocumentRecursively(docRef: FirebaseFirestore.DocumentReference) {
//   const collections = await docRef.listCollections();

//   // Delete all documents in subcollections first
//   for (const col of collections) {
//     const snapshot = await col.get();
//     for (const doc of snapshot.docs) {
//       await deleteDocumentRecursively(doc.ref);
//     }
//   }

//   // Then delete the document itself
//   await docRef.delete();
// }
