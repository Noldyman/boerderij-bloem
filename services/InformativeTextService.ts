import { InfoText, InformativeText } from "@/models/texts";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getImageUrl } from "./imageService";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";

const dir = "informativetexts";

export const getInformativeTexts = async (page: string): Promise<InformativeText[]> => {
  const querySnapshot = await getDocs(query(collection(db, dir), where("page", "==", page)));
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const infoTexts: InfoText[] = doc.data().infoTexts;
    const newInformativeTexts = await Promise.all(
      infoTexts.map(async (item) => {
        const imageUrl = await getImageUrl(dir, item.imageId);
        const htmlText = await createHtmlFromMarkdown(item.text);
        return { ...item, htmlText, imageUrl } as InformativeText;
      })
    );
    return newInformativeTexts;
  }
  return [];
};
