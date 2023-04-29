import { Timestamp } from "firebase/firestore";

export interface Newsitem {
  id: string;
  title: string;
  date: Timestamp;
  message: string;
  htmlContent: string;
  imageUrl?: string;
  likes: number;
}
