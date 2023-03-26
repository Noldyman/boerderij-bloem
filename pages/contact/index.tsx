import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { db, storage } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { Card, Grow, Typography } from "@mui/material";
import { AlternateEmail, Phone, LocationOn } from "@mui/icons-material";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import styles from "../../styles/general.module.scss";

interface ContactInfo {
  address: string;
  city: string;
  contacts: string;
  email: string;
  phoneNumber: string;
  postalCode: string;
}

interface Props {
  introText: any;
  coverImgUrl: string;
  contactInfo: ContactInfo;
}

export default function Contact({ introText, coverImgUrl, contactInfo }: Props) {
  const dimensions = useWindowDimensions();
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    if (!dimensions) return;
    if (dimensions.width <= 1050) {
      setSmallScreen(true);
    } else setSmallScreen(false);
  }, [dimensions]);

  const calcHeight = (height: number) => {
    const maxHeight = dimensions ? dimensions.width * 0.75 : undefined;
    if (maxHeight && maxHeight < height) return maxHeight;
    return height;
  };

  return (
    <>
      <Head>
        <title>Boerderij bloem | contact</title>
        <link rel="icon" href="/contact.png" />
      </Head>
      <div className={styles.introTextContainer}>
        <div className={smallScreen ? styles.introTextSmall : styles.introTextLarge}>
          <Grow in>
            <Card className={styles.card}>
              <h1>Contact</h1>
              <div dangerouslySetInnerHTML={{ __html: introText }} />
            </Card>
          </Grow>
          <Grow in timeout={250}>
            <div className={smallScreen ? styles.contentCoverImageSmall : styles.contentCoverImage}>
              <img src={coverImgUrl} alt="Geen afbeelding" height={calcHeight(400)} />
            </div>
          </Grow>
        </div>
      </div>
      <Grow in timeout={500}>
        <div className={styles.centerDiv}>
          <Card className={styles.contactInfoCard}>
            <Typography align="center" variant="h6">
              {contactInfo.contacts}
            </Typography>
            <div
              className={
                dimensions && dimensions.width <= 800 ? styles.contactInfoSmall : styles.contactInfo
              }
            >
              <div className={styles.contactInfoItem}>
                <LocationOn />
                <p>{contactInfo.address}</p>
                <p>
                  {contactInfo.postalCode}, {contactInfo.city}
                </p>
              </div>
              <div className={styles.contactInfoItem}>
                <AlternateEmail />
                <p>{contactInfo.email}</p>
              </div>
              <div className={styles.contactInfoItem}>
                <Phone />
                <p>{contactInfo.phoneNumber}</p>
              </div>
            </div>
          </Card>
        </div>
      </Grow>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const listRef = ref(storage, "images/coverphotos/contact");
  const res = await listAll(listRef);
  const imgRef = ref(storage, res.items[0].fullPath);
  const coverImgUrl = await getDownloadURL(imgRef);

  const introSnapshot = await getDocs(
    query(
      collection(db, `texts`),
      where("page", "==", "contact"),
      where("identifier", "==", "intro")
    )
  );
  let introText = "Er ging iets mis";
  if (!introSnapshot.empty) {
    introText = introSnapshot.docs[0].data().text;
  }
  const htmlContnent = await createHtmlFromMarkdown(introText);

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

  return {
    props: {
      introText: htmlContnent,
      coverImgUrl: coverImgUrl,
      contactInfo: contactInfo,
    },
  };
};
