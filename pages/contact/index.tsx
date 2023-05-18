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

  const contactInfoItems = [
    { label: contactInfo.address, icon: <LocationOn /> },
    { label: contactInfo.email, icon: <AlternateEmail /> },
    { label: contactInfo.phoneNumber, icon: <Phone /> },
  ];

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
          <div className={`contact-info ${smallScreen && "small"}`}>
            {contactInfoItems.map((item) => (
              <div key={item.label} className="contact-info-item">
                {item.icon}
                <p>{item.label}</p>
              </div>
            ))}
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
