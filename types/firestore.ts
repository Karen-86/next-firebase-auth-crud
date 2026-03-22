import { Timestamp } from "firebase/firestore";

export type FirestoreDoc = {
  id?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
};