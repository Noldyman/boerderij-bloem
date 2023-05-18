import Head from "next/head";
import IntroText from "@/components/intro/introText";
import { getCoverImageUrls } from "@/services/imageService";
import { getIntroText } from "@/services/introTextService";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import { GetStaticProps } from "next";
import InformativeTexts from "@/components/informativeTexts";
import DogKennel from "@/components/dogKennel";

interface Props {
  introText: string;
  coverImgUrls: string[];
}

export default function Index({ introText, coverImgUrls }: Props) {
  return (
    <>
      <Head>
        <title>Boerderij bloem | Solognote schapen</title>
        <link rel="icon" href="/sheep.png" />
      </Head>
      <IntroText title="Solognote schapen" htmlContent={introText} imgUrls={coverImgUrls} />
      <DogKennel title="Onze hulpjes" directory="bordercollies" />
      <InformativeTexts page="solognoteSheep" />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const coverImgUrls = await getCoverImageUrls("solognoteSheep");
  const introText = await getIntroText("solognoteSheep");
  const htmlContnent = await createHtmlFromMarkdown(introText);

  return {
    props: {
      introText: htmlContnent,
      coverImgUrls,
    },
  };
};
