import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNewsitem, likeNewsitem } from "@/services/newsService";
import useNewsitemLikes from "@/utils/useNewsitemLikes";
import { Newsitem } from "@/models/news";
import {
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { format } from "date-fns";

export default function NewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newsitem, setNewsitem] = useState<Newsitem>();
  const { newsitemLikes, setNewsitemLikes } = useNewsitemLikes();
  const { id } = router.query;
  const isLiked = Boolean(newsitemLikes?.includes(newsitem?.id || ""));

  useEffect(() => {
    const fetchNewsitem = async () => {
      if (typeof id !== "string") return;
      setLoading(true);
      const newNewsitem = await getNewsitem(id);
      setNewsitem(newNewsitem);
      setLoading(false);
    };
    fetchNewsitem();
  }, [id]);

  const handleLike = async () => {
    if (!newsitemLikes || !newsitem)
      return alert("Er is iets misgegaan. Probeer het later opnieuw");
    const id = newsitem.id;
    const incrementation = newsitemLikes.includes(id) ? -1 : 1;
    try {
      await likeNewsitem(id, incrementation);
      let newLikes = [];
      if (incrementation > 0) {
        newLikes = [...newsitemLikes, id];
      } else {
        newLikes = newsitemLikes.filter((id) => id !== id);
      }
      setNewsitemLikes(newLikes);
      setNewsitem((prevValue) => {
        if (!prevValue) return undefined;
        return { ...prevValue, likes: prevValue?.likes + incrementation };
      });
    } catch (_) {
      alert("Er is iets misgegaan. Probeer het later opnieuw daar");
    }
  };

  if (loading) return <CircularProgress className="news-loader" />;

  if (!newsitem)
    return (
      <Typography fontStyle="italic" align="center">
        Er is iets misgegaan...
      </Typography>
    );

  return (
    <Fade in timeout={200}>
      <div className="news-item">
        {newsitem.imageUrl && (
          <Fade in>
            <picture>
              <img className="news-image" src={newsitem.imageUrl} alt={newsitem.title} />
            </picture>
          </Fade>
        )}
        <div className="news-content">
          <Typography variant="h3">{newsitem.title}</Typography>
          <Typography variant="subtitle1">{format(newsitem.date.toDate(), "dd-MM-yyy")}</Typography>
          <div dangerouslySetInnerHTML={{ __html: newsitem.htmlContent }} />
          <div>
            <div className="news-item-actions-reverse">
              <Link href="/" legacyBehavior>
                <Button variant="outlined">Terug</Button>
              </Link>
              <IconButton onClick={handleLike}>
                {isLiked ? <Favorite color="secondary" /> : <FavoriteBorder color="secondary" />}
              </IconButton>
              <Chip size="small" label={newsitem.likes || 0} />
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
