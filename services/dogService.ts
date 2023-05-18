import { Dog } from "@/models/dogs";
import { db } from "@/utils/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getImageUrl } from "./imageService";

export const getDogs = async (directory: string): Promise<Dog[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, directory), orderBy("dateOfBirth", "asc"))
  );

  if (!querySnapshot.empty) {
    const newDogs = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const id = doc.id;
        const imageUrl = await getImageUrl(directory, id);
        return { id, ...doc.data(), imageUrl } as Dog;
      })
    );
    return newDogs;
  } else return [];
};
