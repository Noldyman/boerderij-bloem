import { Terrier } from "@/models/terriers";
import { db } from "@/utils/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getImageUrl } from "./imageService";

export const getTerriers = async (): Promise<Terrier[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, "terriers"), orderBy("dateOfBirth", "asc"))
  );

  if (!querySnapshot.empty) {
    const newTerriers = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const id = doc.id;
        const imageUrl = await getImageUrl("terriers", id);
        return { id, ...doc.data(), imageUrl } as Terrier;
      })
    );
    return newTerriers;
  } else return [];
};
