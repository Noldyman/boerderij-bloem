import Head from "next/head";
import IntroText from "@/components/intro/introText";
import { getCoverImageUrls } from "@/services/imageService";
import { getIntroText } from "@/services/introTextService";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { getTerriers } from "@/services/irishTerrierService";
import { Terrier } from "@/models/terriers";
import OurKennel from "./ourKennel";

interface Props {
  introText: string;
  coverImgUrls: string[];
}

export default function Index({ introText, coverImgUrls }: Props) {
  const [terriers, setTerriers] = useState<Terrier[]>([]);

  useEffect(() => {
    const fetchTerriers = async () => {
      const newTerriers = await getTerriers();
      setTerriers(newTerriers);
    };
    fetchTerriers();
  }, []);

  return (
    <>
      <Head>
        <title>Boerderij bloem | Ierse terriërs</title>
        <link rel="icon" href="/terrier.png" />
      </Head>
      <IntroText title="Ierse terriërs" htmlContent={introText} imgUrls={coverImgUrls} />
      <div className="page-content">
        <OurKennel terriers={terriers} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const coverImgUrls = await getCoverImageUrls("irishTerriers");
  const introText = await getIntroText("irishTerriers");
  const htmlContnent = await createHtmlFromMarkdown(introText);

  return {
    props: {
      introText: htmlContnent,
      coverImgUrls,
    },
  };
};
