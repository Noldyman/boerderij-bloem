import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const dir = "introtexts";

export const getIntroText = async (page: string): Promise<string> => {
  const querySnapshot = await getDocs(query(collection(db, dir), where("page", "==", page)));
  let introText = "Er is iets misgegaan...";
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    introText = doc.data().text;
  }
  return introText;
};
