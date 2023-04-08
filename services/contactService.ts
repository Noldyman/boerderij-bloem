import { ContactInfo } from "@/models/contactInfo";
import { db } from "@/utils/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export const getContactInfo = async (): Promise<ContactInfo> => {
  let contactInfo = {
    address: "",
    city: "",
    contacts: "Er ging iets mis",
    email: "",
    phoneNumber: "",
    postalCode: "",
  };
  const contactInfoRef = collection(db, "contactinfo");
  const contactInfoSnap = await getDocs(query(contactInfoRef));
  if (!contactInfoSnap.empty) {
    contactInfo = contactInfoSnap.docs[0].data() as ContactInfo;
  }
  return contactInfo;
};
