import Head from "next/head";
import IntroText from "@/components/intro/introText";
import { getCoverImageUrls } from "@/services/imageService";
import { getIntroText } from "@/services/textService";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import { GetStaticProps } from "next";

interface Props {
  introText: string;
  coverImgUrls: string[];
}

export default function Index({ introText, coverImgUrls }: Props) {
  return (
    <>
      <Head>
        <title>Boerderij bloem | Ierse terriërs</title>
        <link rel="icon" href="/terrier.png" />
      </Head>
      <IntroText title="Ierse terriërs" htmlContent={introText} imgUrls={coverImgUrls} />
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
