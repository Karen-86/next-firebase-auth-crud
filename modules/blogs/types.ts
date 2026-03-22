import { FirestoreDoc, Status } from "@/types";

export type Blog =  {
  status: Status;
  metaTitle?: string;
  metaDescription?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  slug?: string;
  content?: string;
  editorState?: any;
  // tags: string[];
  images?: {[key:string]:string}[];
};

// api response data
export type BlogResponse = FirestoreDoc & Blog

// api request/payload data
export type BlogDto = Blog  
