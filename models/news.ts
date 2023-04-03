import { Timestamp } from "firebase/firestore";

export interface NewsItem {
  id: string;
  title: string;
  date: Timestamp;
  message: string;
  imgUrl?: string;
  likes: number;
  hasImage: boolean;
}
