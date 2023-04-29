import { db, storage } from "@/utils/firebase";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  doc,
  getCountFromServer,
  getDoc,
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
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";

export const getNewsItemCount = async () => {
  const coll = collection(db, "newsitems");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};

const getNewsitemsWithImageIds = async () => {
  const listRef = ref(storage, `images/newsitems`);
  const response = await listAll(listRef);
  const idArr = response.items.map((item) => item.name);
  return idArr;
};

export const getNewsitems = async (
  lastItem?: QueryDocumentSnapshot<DocumentData>
): Promise<{ newsitems: Newsitem[]; lastItem?: QueryDocumentSnapshot<DocumentData> }> => {
  const newsitemsWithImageIds = await getNewsitemsWithImageIds();
  const newsQuery = lastItem
    ? query(collection(db, `newsitems`), orderBy("date", "desc"), startAfter(lastItem), limit(3))
    : query(collection(db, `newsitems`), orderBy("date", "desc"), limit(3));

  const querySnap = await getDocs(newsQuery);

  if (!querySnap.empty) {
    const newNewsitems = await Promise.all(
      querySnap.docs.map(async (doc) => {
        const id = doc.id;
        const data = doc.data();
        let imageUrl = "";

        const htmlContent = await createHtmlFromMarkdown(data.message);

        const itemHasImage = newsitemsWithImageIds.includes(id);
        if (itemHasImage) {
          const newUrl = await getImageUrl("newsitems", id);
          if (typeof newUrl === "string") imageUrl = newUrl;
        }

        return { id, ...data, htmlContent, imageUrl } as Newsitem;
      })
    );
    const newLastItem = querySnap.docs[querySnap.docs.length - 1];

    return { newsitems: newNewsitems, lastItem: newLastItem };
  }

  return { newsitems: [] };
};

export const getNewsitem = async (id: string): Promise<Newsitem | undefined> => {
  const newsitemsWithImageIds = await getNewsitemsWithImageIds();
  const docRef = doc(db, "newsitems/" + id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const htmlContent = await createHtmlFromMarkdown(data.message);

    let imageUrl = "";
    const itemHasImage = newsitemsWithImageIds.includes(id);
    if (itemHasImage) {
      const newUrl = await getImageUrl("newsitems", id);
      if (typeof newUrl === "string") imageUrl = newUrl;
    }

    return { id, ...data, htmlContent, imageUrl } as Newsitem;
  }
};

export const likeNewsitem = async (id: string, incrementation: -1 | 1) => {
  await updateDoc(doc(db, `newsitems/${id}`), {
    likes: increment(incrementation),
  });
};
