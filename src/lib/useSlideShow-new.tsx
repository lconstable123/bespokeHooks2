import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useSlideShow({
  count = 5,
  delay = 2000,
}: { count?: number; delay?: number } = {}) {
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [currentImg, setCurrentImg] = useState<number | null>(null);
  const [urls] = useState(() =>
    Array.from(
      { length: count },
      (_, i) => `https://picsum.photos/800/600?random=${i + Math.random()}`,
    ),
  );

  //-----------------------------------------------------------------------

  async function loadImages() {
    const loadingToast = toast.loading("Loading images...");
    setLoadingImages(true);

    try {
      const loadedurls = await Promise.all(
        urls.map(
          (url) =>
            new Promise<string>((resolve, reject) => {
              const img = new window.Image();
              img.onload = () => resolve(url);
              img.onerror = (err) => reject(new Error(`${err}`));
              img.src = url;
            }),
        ),
      );
      setImages(loadedurls);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(String(error));
      }
    } finally {
      toast.dismiss(loadingToast);
      toast.success("images loaded");
      setLoadingImages(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, [urls]);

  useEffect(() => {
    if (loadingImages || images.length === 0) return;
    let interval: ReturnType<typeof setInterval>;
    if (!loadingImages) {
      interval = setInterval(() => {
        setCurrentImg((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % images.length;
        });
      }, delay);
    }

    return () => {
      setCurrentImg(null);
      clearInterval(interval);
    };
  }, [loadingImages, images]);

  return {
    images,
    loadingImages,
    selectedImage: currentImg,
    isLoading: loadingImages,
  };
}
