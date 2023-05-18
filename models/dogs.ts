import { Timestamp } from "firebase/firestore";

export interface Dog {
  id: string;
  name: string;
  dateOfBirth: Timestamp;
  description: string;
  imageUrl: string;
}
