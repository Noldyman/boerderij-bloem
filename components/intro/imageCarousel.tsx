import useWindowDimensions from "@/utils/useWindowDimensions";
import Carousel from "react-material-ui-carousel";

interface Margins {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface Props {
  imgUrls: string[];
  height: number;
  width: number;
  margins?: Margins;
}

export default function ImageCarousel({ imgUrls, height, width, margins }: Props) {
  const dimensions = useWindowDimensions();

  const calcHeight = (height: number) => {
    const maxHeight = dimensions ? dimensions.width * 0.75 : undefined;
    if (maxHeight && maxHeight < height) return maxHeight;
    return height;
  };

  const calcWidth = (width: number) => {
    const maxWidth = dimensions ? dimensions.width : undefined;
    if (maxWidth && maxWidth < width) return maxWidth;
    return width;
  };

  const createStyles = () => {
    let styles: { [key: string]: number } = {};
    if (margins) {
      if (margins.top) styles["marginTop"] = margins.top;
      if (margins.right) styles["marginRight"] = margins.right;
      if (margins.bottom) styles["marginBottom"] = margins.bottom;
      if (margins.left) styles["marginLeft"] = margins.left;
    }
    return styles;
  };

  return (
    <div style={createStyles()}>
      <Carousel
        sx={{
          width: calcWidth(width),
        }}
        height={calcHeight(height)}
        indicators={false}
        duration={2000}
        interval={10000}
      >
        {imgUrls.map((imgUrl) => (
          <picture key={imgUrl}>
            <img
              height={calcHeight(height)}
              width={calcWidth(width)}
              className="image"
              src={imgUrl}
              alt="Geen afbeelding"
            />
          </picture>
        ))}
      </Carousel>
    </div>
  );
}
