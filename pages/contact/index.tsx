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
import IntroText from "@/components/introText";

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
  coverImgUrls: string[];
  contactInfo: ContactInfo;
}

export default function Contact({ introText, coverImgUrls, contactInfo }: Props) {
  const dimensions = useWindowDimensions();
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    if (!dimensions) return;
    if (dimensions.width <= 800) {
      setSmallScreen(true);
    } else setSmallScreen(false);
  }, [dimensions]);

  return (
    <>
      <Head>
        <title>Boerderij bloem | contact</title>
        <link rel="icon" href="/contact.png" />
      </Head>
      <IntroText title="Contact" htmlContent={introText} imgUrls={coverImgUrls} />
      <Grow in timeout={500}>
        <div className="center-div">
          <Card className="contact-info-card">
            <Typography align="center" variant="h6">
              {contactInfo.contacts}
            </Typography>
            <div className={smallScreen ? "contact-info-small" : "contact-info"}>
              <div className="contact-info-item">
                <LocationOn />
                <p>{contactInfo.address}</p>
                <p>
                  {contactInfo.postalCode}, {contactInfo.city}
                </p>
              </div>
              <div className="contact-info-item">
                <AlternateEmail />
                <p>{contactInfo.email}</p>
              </div>
              <div className="contact-info-item">
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
  const coverImgUrls = await Promise.all(
    res.items.map(async (item) => {
      const imgRef = ref(storage, item.fullPath);
      return await getDownloadURL(imgRef);
    })
  );

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
      coverImgUrls,
      contactInfo,
    },
  };
};
