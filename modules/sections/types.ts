import { FirestoreDoc, Status } from "@/types";

export type Section = {
  status?: Status;
  title?: string;
  description?: string;
  sectionName?: string;
  images?: { [key: string]: string }[];
};

// api response data
export type SectionResponse = FirestoreDoc &  Section 

// api request/payload data
export type SectionDto = Section  