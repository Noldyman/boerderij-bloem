import { db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getImageUrl } from "./imageService";
import { NewsItem } from "@/models/news";

export const getNewsitems = async (): Promise<NewsItem[]> => {
  const querySnap = await getDocs(
    query(collection(db, `newsitems`), orderBy("date", "desc"), limit(10))
  );
  if (!querySnap.empty) {
    const newsitems: any[] = await Promise.all(
      querySnap.docs.map(async (doc) => {
        const imgUrl = await getImageUrl("newsitems", doc.id);
        return { id: doc.id, ...doc.data(), imgUrl };
      })
    );
    return newsitems;
  }
  return [];
};

export const likeNewsitem = async (id: string, incrementation: -1 | 1) => {
  await updateDoc(doc(db, `newsitems/${id}`), {
    likes: increment(incrementation),
  });
};
