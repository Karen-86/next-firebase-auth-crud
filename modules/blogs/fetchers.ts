import { doc, getDoc, getDocs, collection, query, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config/firebaseClient";
import { notFound } from "next/navigation";

export async function fetchBlogs() {
  try {
    const blogsRef = collection(db, "blogs");
    const blogsSnap = await getDocs(blogsRef);
    const data = blogsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    //  await new Promise((resolve) => setTimeout(() => resolve("done"), 5000));
    return {
      success: true,
      message: 'success',
      data: data.map((item: any) => {
        const { createdAt, updatedAt, ...rest } = item;
        return rest;
      }),
    };
  } catch (err: any) {
    console.error("=fetchBlogs= error:", err);
    return { success: false, message: err.message, data: [] };
  }
}

export async function fetchBlog({ blogId = "" }) {
  try {
    if (!blogId) throw new Error("Invalid ID");
    
    const blogsRef = collection(db, "blogs");
    const blogRef = doc(blogsRef, blogId);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) throw new Error("Document not found");

    const data: any = { id: blogSnap.id, ...blogSnap.data() };
    const { createdAt, updatedAt, ...rest } = data;

    return { success: true, message: 'success', data: rest };
  } catch (err: any) {
    console.error("=fetchBlog= error:", err);
    return { success: false, message: err.message, data: {} };
  }
}
