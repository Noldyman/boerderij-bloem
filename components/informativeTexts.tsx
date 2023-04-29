import { InformativeText } from "@/models/texts";
import { getInformativeTexts } from "@/services/InformativeTextService";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { Card, Divider, Fade, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  page: string;
}
export default function InformativeTexts({ page }: Props) {
  const dimensions = useWindowDimensions();
  const [textItems, setTextItems] = useState<InformativeText[]>([]);
  const smallScreen = Boolean(dimensions && dimensions.width < 600);

  useEffect(() => {
    const fetchTextItems = async () => {
      const newTextItems = await getInformativeTexts(page);
      setTextItems(newTextItems);
    };
    fetchTextItems();
  }, [page]);

  if (!textItems.length) return <></>;

  return (
    <Fade in>
      <div className="info-texts">
        {textItems.map((item, i) => {
          const isReverse = Boolean(i % 2 !== 0);
          return (
            <>
              {i !== 0 && <Divider />}
              <div
                key={item.imageId}
                className={
                  smallScreen ? "info-text-small" : `info-text ${isReverse && "info-text-reverse"}`
                }
              >
                <picture>
                  <img
                    className={smallScreen ? "info-text-image-small" : "info-text-image"}
                    src={item.imageUrl}
                    alt={item.title}
                  />
                </picture>
                <div className="info-text-content">
                  <Typography variant="h4">{item.title}</Typography>
                  <div dangerouslySetInnerHTML={{ __html: item.htmlText }} />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </Fade>
  );
}
