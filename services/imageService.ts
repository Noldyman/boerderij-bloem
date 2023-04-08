import { storage } from "@/utils/firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

export const getCoverImageUrls = async (page: string) => {
  const listRef = ref(storage, `images/coverphotos/${page}`);
  const response = await listAll(listRef);

  const coverImgUrls = await Promise.all(
    response.items.map(async (item) => {
      const imgRef = ref(storage, item.fullPath);
      return await getDownloadURL(imgRef);
    })
  );
  return coverImgUrls;
};

export const getImageUrl = async (dir: string, id: string) => {
  const imgRef = ref(storage, `images/${dir}/${id}`);
  try {
    const imgUrl = await getDownloadURL(imgRef);
    return imgUrl;
  } catch (_) {
    return "";
  }
};
