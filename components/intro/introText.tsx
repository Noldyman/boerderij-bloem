import useWindowDimensions from "@/utils/useWindowDimensions";
import { Card, Grow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ImageCarousel from "./imageCarousel";

interface Props {
  title: string;
  htmlContent: string;
  imgUrls: string[];
}

export default function IntroText({ title, htmlContent, imgUrls }: Props) {
  const dimensions = useWindowDimensions();

  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    if (!dimensions) return;
    if (dimensions.width <= 1050) {
      setSmallScreen(true);
    } else setSmallScreen(false);
  }, [dimensions]);

  return (
    <div className="intro-text-container">
      <div className={smallScreen ? "intro-text-small" : "intro-text-large"}>
        <Grow in timeout={smallScreen ? 500 : 0}>
          <Card className="card">
            <Typography variant="h3">{title}</Typography>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </Card>
        </Grow>
        <Grow in timeout={smallScreen ? 0 : 500}>
          <div className="background-div">
            <ImageCarousel
              imgUrls={imgUrls}
              height={450}
              width={600}
              margins={smallScreen ? { bottom: -20 } : { top: -30, left: -40 }}
            />
          </div>
        </Grow>
      </div>
    </div>
  );
}
