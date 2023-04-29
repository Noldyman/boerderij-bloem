import Head from "next/head";
import { GetStaticProps } from "next";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import IntroText from "@/components/intro/introText";
import { getIntroText } from "@/services/introTextService";
import { getCoverImageUrls } from "@/services/imageService";
import Newsitems from "@/components/news/newsitems";

interface Props {
  introText: string;
  coverImgUrls: string[];
}

export default function Home({ introText, coverImgUrls }: Props) {
  return (
    <>
      <Head>
        <title>Boerderij bloem | home</title>
        <link rel="icon" href="/flower.png" />
      </Head>
      <IntroText title="Welkom" htmlContent={introText} imgUrls={coverImgUrls} />
      <Newsitems />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const coverImgUrls = await getCoverImageUrls("home");
  const introText = await getIntroText("home");
  const htmlContnent = await createHtmlFromMarkdown(introText);

  return {
    props: {
      introText: htmlContnent,
      coverImgUrls,
    },
  };
};
