export interface InfoText {
  title: string;
  text: string;
  imageId: string;
}

export interface InfoTextCollextion {
  page: string;
  infoTexts: InfoText[];
}

export interface InformativeText extends InfoText {
  imageUrl: string;
  htmlText: string;
}
