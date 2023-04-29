import { useEffect, useState } from "react";

export default function useNewsitemLikes() {
  const [newsitemLikes, setNewsitemLikes] = useState<string[]>();

  useEffect(() => {
    const likes = localStorage.getItem("newsitem-likes")?.split(",");
    if (likes) setNewsitemLikes(likes);
    else setNewsitemLikes([]);
  }, []);

  useEffect(() => {
    if (!newsitemLikes) return;
    localStorage.setItem("newsitem-likes", newsitemLikes.join(","));
  }, [newsitemLikes]);

  return { newsitemLikes, setNewsitemLikes };
}
