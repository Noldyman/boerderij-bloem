import Head from "next/head";
import { GetStaticProps } from "next";
import { db, storage } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import IntroText from "@/components/introText";

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
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const listRef = ref(storage, "images/coverphotos/home");
  const res = await listAll(listRef);
  const coverImgUrls = await Promise.all(
    res.items.map(async (item) => {
      const imgRef = ref(storage, item.fullPath);
      return await getDownloadURL(imgRef);
    })
  );

  const querySnapshot = await getDocs(
    query(collection(db, `texts`), where("page", "==", "home"), where("identifier", "==", "intro"))
  );
  let introText = "No data";
  if (!querySnapshot.empty) {
    introText = querySnapshot.docs[0].data().text;
  }
  const htmlContnent = await createHtmlFromMarkdown(introText);

  return {
    props: {
      introText: htmlContnent,
      coverImgUrls,
    },
  };
};
