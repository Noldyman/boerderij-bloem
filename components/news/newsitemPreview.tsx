import { Newsitem } from "@/models/news";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Button, Chip, Divider, IconButton, Typography, Fade } from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";

interface Props {
  newsitem: Newsitem;
  index: number;
  isLiked: boolean;
  onLike: () => void;
}

export default function NewsitemPreview({ newsitem, index, isLiked, onLike }: Props) {
  const dimensions = useWindowDimensions();
  const smallScreen = Boolean(dimensions && dimensions.width <= 800);
  const isEven = Boolean(index % 2 === 0);

  return (
    <>
      {index > 0 && <Divider />}
      <div
        className={`
        ${newsitem.imageUrl ? "news-item-with-img" : ""} ${
          smallScreen ? "news-item-with-img-small" : !isEven ? "news-item-with-img-reverse" : ""
        }
        `}
      >
        {newsitem.imageUrl && (
          <Fade in>
            <div className="news-preview-image">
              <picture>
                <img className="image" width="100%" src={newsitem.imageUrl} alt="Geen afbeelding" />
              </picture>
            </div>
          </Fade>
        )}
        <Fade in>
          <div className={`news-item-text ${!isEven && "news-item-text-reverse"}`}>
            <div>
              <Typography variant="h6">{newsitem.title}</Typography>
              <Typography variant="subtitle1">
                {format(newsitem.date.toDate(), "dd-MM-yyy")}
              </Typography>
            </div>
            <div
              className="news-item-message"
              dangerouslySetInnerHTML={{ __html: newsitem.htmlContent }}
            />
            <div className={`news-item-actions ${!isEven && "news-item-actions-reverse"}`}>
              <Link href={`nieuws/${newsitem.id}`} legacyBehavior>
                <Button color="primary" variant="outlined">
                  Lees meer
                </Button>
              </Link>
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
