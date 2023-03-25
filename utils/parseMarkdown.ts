import { remark } from "remark";
import html from "remark-html";

export const createHtmlFromMarkdown = async (markdownString: string) => {
  const processedContent = await remark().use(html).process(markdownString);
  const htmlContnent = processedContent.toString();

  return htmlContnent;
};
