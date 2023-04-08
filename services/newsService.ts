import { db } from "@/utils/firebase";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { getImageUrl } from "./imageService";
import { NewsItem } from "@/models/news";

export const getNewsItemCount = async () => {
  const coll = collection(db, "newsitems");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};

export const getNewsitems = async (
  lastItem?: QueryDocumentSnapshot<DocumentData>
): Promise<{ newsitems: NewsItem[]; lastItem?: QueryDocumentSnapshot<DocumentData> }> => {
  const newsQuery = lastItem
    ? query(collection(db, `newsitems`), orderBy("date", "desc"), startAfter(lastItem), limit(3))
    : query(collection(db, `newsitems`), orderBy("date", "desc"), limit(3));

  const querySnap = await getDocs(newsQuery);
  if (!querySnap.empty) {
    const newsitems: any[] = await Promise.all(
      querySnap.docs.map(async (doc) => {
        const imgUrl = await getImageUrl("newsitems", doc.id);
        return { id: doc.id, ...doc.data(), imgUrl };
      })
    );
    const lastItem = querySnap.docs[querySnap.docs.length - 1];
    return { newsitems, lastItem };
  }
  return { newsitems: [] };
};

export const likeNewsitem = async (id: string, incrementation: -1 | 1) => {
  await updateDoc(doc(db, `newsitems/${id}`), {
    likes: increment(incrementation),
  });
};
