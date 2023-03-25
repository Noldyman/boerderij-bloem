import { GetStaticProps } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { db, storage } from "@/utils/firebase";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import useWindowDimensions from "@/utils/useWindowDimensions";
import Head from "next/head";
import { Card, Grow } from "@mui/material";
import ImageCarousel from "@/components/imageCarousel";
import styles from "../styles/general.module.scss";

interface Props {
  introText: any;
  coverImgUrls: string[];
}

export default function Home({ introText, coverImgUrls }: Props) {
  const dimensions = useWindowDimensions();

  return (
    <>
      <Head>
        <title>Boerderij bloem | home</title>
        <link rel="icon" href="/flower.png" />
      </Head>
      <div className={styles.introTextContainer}>
        <div
          className={
            dimensions && dimensions.width <= 1050 ? styles.introTextSmall : styles.introTextLarge
          }
        >
          <Grow in timeout={dimensions && dimensions.width <= 1050 ? 500 : 0}>
            <Card className={styles.card}>
              <h1>Welkom</h1>
              <div dangerouslySetInnerHTML={{ __html: introText }} />
            </Card>
          </Grow>
          <Grow in timeout={dimensions && dimensions.width > 1050 ? 500 : 0}>
            <div className={styles.backgroundDiv}>
              <ImageCarousel
                imgUrls={coverImgUrls}
                height={450}
                width={600}
                margins={
                  dimensions && dimensions.width <= 1050 ? { bottom: -20 } : { top: -30, left: -40 }
                }
              />
            </div>
          </Grow>
        </div>
      </div>
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
      coverImgUrls: coverImgUrls,
    },
  };
};
