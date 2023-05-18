import { Terrier } from "@/models/terriers";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { Card, Divider, Fade, Typography } from "@mui/material";
import { format } from "date-fns";

interface Props {
  terriers: Terrier[];
}

export default function OurKennel({ terriers }: Props) {
  const dimensions = useWindowDimensions();
  const smallscreen = Boolean(dimensions && dimensions.width < 500);

  if (!terriers.length) return <></>;
  return (
    <Fade in>
      <Card className="card">
        <Typography variant="h4">Onze kennel</Typography>
        <div className="terriers">
          {terriers.map((terrier, i) => (
            <>
              {smallscreen && i !== 0 && <Divider />}
              <div key={terrier.id} className={`terrier ${smallscreen && "small"}`}>
                <picture>
                  <img className="terrier-profile-pic" src={terrier.imageUrl} alt={terrier.name} />
                </picture>
                <div>
                  <Typography variant="h6">{terrier.name}</Typography>
                  <Typography>{format(terrier.dateOfBirth.toDate(), "dd-MM-yyy")}</Typography>
                  <Typography>{terrier.description}</Typography>
                </div>
              </div>
            </>
          ))}
        </div>
      </Card>
    </Fade>
  );
}
