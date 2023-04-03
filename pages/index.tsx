import Head from "next/head";
import { GetStaticProps } from "next";
import { db, storage } from "@/utils/firebase";
import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { createHtmlFromMarkdown } from "@/utils/parseMarkdown";
import IntroText from "@/components/introText";
import { Typography, CircularProgress, Fade } from "@mui/material";
import { useEffect, useState } from "react";
import { NewsItem } from "@/models/news";
import NewsitemPreview from "@/components/layout/news/newsitemPreview";
import NewsitemDialog from "@/components/layout/news/newsitemDialog";

interface Props {
  introText: string;
  coverImgUrls: string[];
}

export default function Home({ introText, coverImgUrls }: Props) {
  const [newsitemsLoading, setNewsitemsLoading] = useState(false);
  const [newsitems, setNewsitems] = useState<NewsItem[]>([]);
  const [openNewsitem, setOpenNewsitem] = useState<NewsItem | undefined>();
  const [newsitemLikes, setNewsitemLikes] = useState<string[] | undefined>();

  useEffect(() => {
    const fetchNewsitems = async () => {
      setNewsitemsLoading(true);
      const newitemsSnap = await getDocs(
        query(collection(db, `newsitems`), orderBy("date", "desc"), limit(10))
      );
      if (!newitemsSnap.empty) {
        const newNewsItems: any[] = await Promise.all(
          newitemsSnap.docs.map(async (doc) => {
            let imgUrl = undefined;
            const imgRef = ref(storage, "images/newsitems/" + doc.id);
            await getDownloadURL(imgRef)
              .then((link) => {
                imgUrl = link;
              })
              .catch((_) => {});
            return { id: doc.id, ...doc.data(), imgUrl };
          })
        );
        setNewsitems(newNewsItems);
      }
      setNewsitemsLoading(false);
    };

    const getLikes = () => {
      const newLikes = localStorage.getItem("newsitem-likes")?.split(",");
      if (newLikes) setNewsitemLikes(newLikes);
    };

    fetchNewsitems();
    getLikes();
  }, []);

  useEffect(() => {
    if (!newsitemLikes) return;
    localStorage.setItem("newsitem-likes", newsitemLikes.join(","));
  }, [newsitemLikes]);

  const handleLike = async (newsitemId: string) => {
    if (!newsitemLikes) return alert("Er is iets misgegaan. Probeer het later opnieuw");
    const incrementation = newsitemLikes?.includes(newsitemId) ? -1 : 1;
    try {
      await updateDoc(doc(db, `newsitems/${newsitemId}`), {
        likes: increment(incrementation),
      });
      let newLikes = [];
      if (incrementation > 0) {
        newLikes = [...newsitemLikes, newsitemId];
      } else {
        newLikes = newsitemLikes.filter((id) => id !== newsitemId);
      }
      setNewsitemLikes(newLikes);
      setNewsitems((prevValue) =>
        prevValue.map((item) => {
          if (item.id === newsitemId) return { ...item, likes: item.likes + incrementation };
          return item;
        })
      );
      if (openNewsitem && openNewsitem.id === newsitemId) {
        setOpenNewsitem((prevValue) => ({
          ...prevValue!,
          likes: prevValue!.likes + incrementation,
        }));
      }
    } catch (_) {
      alert("Er is iets misgegaan. Probeer het later opnieuw");
    }
  };

  const handleOpenNewsitem = (newsitem: NewsItem) => {
    setOpenNewsitem(newsitem);
  };

  const handleCloseNewsitem = () => {
    setOpenNewsitem(undefined);
  };

  return (
    <>
      <Head>
        <title>Boerderij bloem | home</title>
        <link rel="icon" href="/flower.png" />
      </Head>
      <IntroText title="Welkom" htmlContent={introText} imgUrls={coverImgUrls} />

      <Fade in timeout={1000}>
        <div className="news-div">
          <Typography variant="h3" align="center">
            Nieuws
          </Typography>
          {newsitemsLoading ? (
            <CircularProgress className="news-loader" />
          ) : (
            newsitems.map((item, i) => (
              <NewsitemPreview
                key={i}
                newsitem={item}
                index={i}
                isLiked={Boolean(newsitemLikes?.includes(item.id))}
                onLike={() => handleLike(item.id)}
                onOpen={handleOpenNewsitem}
              />
            ))
          )}
        </div>
      </Fade>

      {openNewsitem && (
        <NewsitemDialog
          newsitem={openNewsitem}
          onClose={handleCloseNewsitem}
          isLiked={Boolean(newsitemLikes?.includes(openNewsitem.id))}
          onLike={handleLike}
        />
      )}
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
