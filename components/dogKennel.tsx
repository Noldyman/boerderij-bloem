import { useEffect, useState } from "react";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { getDogs } from "@/services/dogService";
import { Dog } from "@/models/dogs";
import { Card, Divider, Fade, Typography } from "@mui/material";
import { format } from "date-fns";

interface Props {
  title: string;
  directory: string;
}

export default function DogKennel({ title, directory }: Props) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const dimensions = useWindowDimensions();
  const smallscreen = Boolean(dimensions && dimensions.width < 500);

  useEffect(() => {
    const fetchDogs = async () => {
      const newDogs = await getDogs(directory);
      setDogs(newDogs);
    };
    fetchDogs();
  }, [directory]);

  if (!dogs.length) return <></>;
  return (
    <Fade in>
      <Card className="card">
        <Typography variant="h4">{title}</Typography>
        <div className="dogs">
          {dogs.map((dog, i) => (
            <>
              {smallscreen && i !== 0 && <Divider />}
              <div key={dog.id} className={`dog ${smallscreen && "small"}`}>
                <picture>
                  <img className="dog-profile-pic" src={dog.imageUrl} alt={dog.name} />
                </picture>
                <div>
                  <Typography variant="h6">{dog.name}</Typography>
                  <Typography>{format(dog.dateOfBirth.toDate(), "dd-MM-yyy")}</Typography>
                  <Typography>{dog.description}</Typography>
                </div>
              </div>
            </>
          ))}
        </div>
      </Card>
    </Fade>
  );
}
