import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getIntroText = async (page: string) => {
  const querySnapshot = await getDocs(
    query(collection(db, `texts`), where("page", "==", page), where("identifier", "==", "intro"))
  );
  let introText = "Er is iets misgegaan...";
  if (!querySnapshot.empty) {
    introText = querySnapshot.docs[0].data().text;
  }
  return introText;
};
