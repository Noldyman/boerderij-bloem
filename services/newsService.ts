import { db, storage } from "@/utils/firebase";
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
import { Newsitem } from "@/models/news";
import { listAll, ref } from "firebase/storage";

export const getNewsItemCount = async () => {
  const coll = collection(db, "newsitems");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};

export const getNewsitemsWithImageIds = async () => {
  const listRef = ref(storage, `images/newsitems`);
  const response = await listAll(listRef);
  const idArr = response.items.map((item) => item.name);
  return idArr;
};

export const getNewsitems = async (
  newsitemsWithImageIds: string[],
  lastItem?: QueryDocumentSnapshot<DocumentData>
): Promise<{ newsitems: Newsitem[]; lastItem?: QueryDocumentSnapshot<DocumentData> }> => {
  const newsQuery = lastItem
    ? query(collection(db, `newsitems`), orderBy("date", "desc"), startAfter(lastItem), limit(3))
    : query(collection(db, `newsitems`), orderBy("date", "desc"), limit(3));

  const querySnap = await getDocs(newsQuery);

  if (!querySnap.empty) {
    const newNewsitems = await Promise.all(
      querySnap.docs.map(async (doc) => {
        const id = doc.id;
        let imageUrl = "";

        const itemHasImage = newsitemsWithImageIds.includes(id);
        if (itemHasImage) {
          const newUrl = await getImageUrl("newsitems", id);
          if (typeof newUrl === "string") imageUrl = newUrl;
        }

        return { id, ...doc.data(), imageUrl } as Newsitem;
      })
    );
    const newLastItem = querySnap.docs[querySnap.docs.length - 1];
    return { newsitems: newNewsitems, lastItem: newLastItem };
  }
  return { newsitems: [] };
};

export const likeNewsitem = async (id: string, incrementation: -1 | 1) => {
  await updateDoc(doc(db, `newsitems/${id}`), {
    likes: increment(incrementation),
  });
};
