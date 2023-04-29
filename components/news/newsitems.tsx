import { Newsitem } from "@/models/news";
import { getNewsItemCount, getNewsitems, likeNewsitem } from "@/services/newsService";
import { Button, Card, CircularProgress, Fade, Tooltip, Typography } from "@mui/material";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import NewsitemPreview from "./newsitemPreview";
import useNewsitemLikes from "@/utils/useNewsitemLikes";

export default function Newsitems() {
  const [newsitemsLoading, setNewsitemsLoading] = useState(false);
  const [moreNewsitemsLoading, setMoreNewsitemsLoading] = useState(false);
  const [newsitemCount, setNewsitemCount] = useState(0);
  const [newsitems, setNewsitems] = useState<Newsitem[]>([]);
  const [lastNewsitem, setLastNewsitem] = useState<QueryDocumentSnapshot<DocumentData>>();
  const { newsitemLikes, setNewsitemLikes } = useNewsitemLikes();

  useEffect(() => {
    const fetchNewsitems = async () => {
      setNewsitemsLoading(true);
      const count = await getNewsItemCount();
      const { newsitems, lastItem } = await getNewsitems();
      setNewsitemCount(count);
      setNewsitems(newsitems);
      setLastNewsitem(lastItem);
      setNewsitemsLoading(false);
    };
    fetchNewsitems();
  }, []);

  const handleLike = async (newsitemId: string) => {
    if (!newsitemLikes) return alert("Er is iets misgegaan. Probeer het later opnieuw");
    const incrementation = newsitemLikes?.includes(newsitemId) ? -1 : 1;
    try {
      await likeNewsitem(newsitemId, incrementation);
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
    } catch (_) {
      alert("Er is iets misgegaan. Probeer het later opnieuw");
    }
  };

  const handleMoreNewsItems = async () => {
    if (!lastNewsitem) return;
    setMoreNewsitemsLoading(true);
    const { newsitems, lastItem } = await getNewsitems(lastNewsitem);
    setNewsitems((prevValue) => [...prevValue, ...newsitems]);
    setLastNewsitem(lastItem);
    setMoreNewsitemsLoading(false);
  };
  if (newsitemsLoading) return <CircularProgress className="news-loader" />;

  return (
    <>
      <Fade in timeout={1000}>
        <Card className="card">
          <div className="news-div">
            <Typography variant="h4">Nieuws</Typography>
            {newsitems.map((item, i) => (
              <NewsitemPreview
                key={i}
                newsitem={item}
                index={i}
                isLiked={Boolean(newsitemLikes?.includes(item.id))}
                onLike={() => handleLike(item.id)}
              />
            ))}
            {moreNewsitemsLoading ? (
              <CircularProgress className="news-loader" />
            ) : (
              <>
                <Button
                  className="more-news-button"
                  disabled={newsitemCount <= newsitems.length}
                  variant="outlined"
                  onClick={handleMoreNewsItems}
                >
                  Meer nieuws
                </Button>
                {newsitemCount <= newsitems.length && (
                  <Typography textAlign="center" marginTop="-15px" fontStyle="italic">
                    Er zijn geen berichten meer
                  </Typography>
                )}
              </>
            )}
          </div>
        </Card>
      </Fade>
    </>
  );
}
