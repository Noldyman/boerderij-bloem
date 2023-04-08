import { NewsItem } from "@/models/news";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Button, Chip, Dialog, Divider, IconButton, Typography } from "@mui/material";
import { format } from "date-fns";

interface Props {
  newsitem: NewsItem;
  onClose: () => void;
  isLiked: boolean;
  onLike: (newsitemId: string) => void;
}

export default function NewsitemDialog({ newsitem, onClose, isLiked, onLike }: Props) {
  return (
    <Dialog open={Boolean(newsitem)} onClose={onClose} fullWidth>
      <div className="newsitem-dialog">
        <picture>
          <img src={newsitem.imgUrl} width="100%" alt="Geen afbeelding" />
        </picture>
        <Typography variant="h5">{newsitem.title}</Typography>
        <Typography variant="subtitle1">{format(newsitem.date.toDate(), "dd-MM-yyy")}</Typography>
        <br />
        <Typography>{newsitem.message}</Typography>
      </div>
      <Divider />
      <div className="newsitem-dialog-actions">
        <div>
          <IconButton onClick={() => onLike(newsitem.id)}>
            {isLiked ? <Favorite color="secondary" /> : <FavoriteBorder color="secondary" />}
          </IconButton>
          <Chip size="small" label={newsitem.likes || 0} />
        </div>
        <Button variant="outlined" onClick={onClose}>
          Sluiten
        </Button>
      </div>
    </Dialog>
  );
}
