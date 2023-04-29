import Head from "next/head";
import { GetStaticProps } from "next";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { Card, Fade, Typography } from "@mui/material";
import { AlternateEmail, Phone, LocationOn } from "@mui/icons-material";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import IntroText from "@/components/intro/introText";

import { getIntroText } from "@/services/introTextService";
import { getCoverImageUrls } from "@/services/imageService";
import { getContactInfo } from "@/services/contactService";
import { ContactInfo } from "@/models/contactInfo";

interface Props {
  introText: string;
  coverImgUrls: string[];
  contactInfo: ContactInfo;
}

export default function Contact({ introText, coverImgUrls, contactInfo }: Props) {
  const dimensions = useWindowDimensions();
  const smallScreen = Boolean(dimensions && dimensions.width <= 800);

  return (
    <>
      <Head>
        <title>Boerderij bloem | contact</title>
        <link rel="icon" href="/contact.png" />
      </Head>
      <IntroText title="Contact" htmlContent={introText} imgUrls={coverImgUrls} />
      <Fade in>
        <Card className="card contact-info-card">
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
      </Fade>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const coverImgUrls = await getCoverImageUrls("contact");
  const introText = await getIntroText("contact");
  const htmlContnent = await createHtmlFromMarkdown(introText);
  const contactInfo = await getContactInfo();

  return {
    props: {
      introText: htmlContnent,
      coverImgUrls,
      contactInfo,
    },
  };
};
