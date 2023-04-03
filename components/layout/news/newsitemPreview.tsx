import { NewsItem } from "@/models/news";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Button, Chip, Divider, IconButton, Typography, Fade, Card } from "@mui/material";
import { format } from "date-fns";

interface Props {
  newsitem: NewsItem;
  index: number;
  isLiked: boolean;
  onLike: () => void;
  onOpen: (newsitem: NewsItem) => void;
}

export default function NewsitemPreview({ newsitem, index, isLiked, onLike, onOpen }: Props) {
  const dimensions = useWindowDimensions();
  const smallScreen = Boolean(dimensions && dimensions.width <= 800);
  const isEven = Boolean(index % 2 === 0);

  return (
    <>
      {index > 0 && <Divider />}
      <div
        className={`
        ${newsitem.imgUrl ? "news-item-with-img" : ""} ${
          smallScreen ? "news-item-with-img-small" : !isEven ? "news-item-with-img-reverse" : ""
        }
        `}
      >
        {newsitem.imgUrl && (
          <Fade in>
            <div className={`news-image ${!isEven && "news-image-reverse"}`}>
              <picture>
                <img className="image" width="100%" src={newsitem.imgUrl} alt="Geen afbeelding" />
              </picture>
            </div>
          </Fade>
        )}
        <Fade in>
          <div className={`news-item-text ${!isEven && "news-item-text-reverse"}`}>
            <div>
              <Typography variant="h5">{newsitem.title}</Typography>
              <Typography variant="subtitle1">
                {format(newsitem.date.toDate(), "dd-MM-yyy")}
              </Typography>
            </div>
            <Typography className="news-item-message">{newsitem.message}</Typography>
            <div className={`news-item-actions ${!isEven && "news-item-actions-reverse"}`}>
              <Button color="primary" variant="outlined" onClick={() => onOpen(newsitem)}>
                Lees meer
              </Button>
              <div>
                <IconButton onClick={onLike}>
                  {isLiked ? <Favorite color="secondary" /> : <FavoriteBorder color="secondary" />}
                </IconButton>
                <Chip size="small" label={newsitem.likes || 0} />
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </>
  );
}
