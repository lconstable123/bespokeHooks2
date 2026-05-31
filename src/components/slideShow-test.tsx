import { useSlideShow } from "../lib/useSlideShow-new";
import { AnimatePresence, motion } from "framer-motion";
export const SlideShowTest = () => {
  const { images, selectedImage, isLoading } = useSlideShow({
    delay: 3000,
    count: 6,
  });
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start gap-2 bg-amber-300">
      <div className="my-40 relative flex items-center justify-center ">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <PlaceholderImg />
          ) : (
            images.map((src, i) => (
              <motion.img
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                key={i}
                src={src}
                alt={`Slide ${i}`}
                className="w-50 h-50 object-cover"
              />
            ))
          )}
        </AnimatePresence>
      </div>
      <div className=" w-50 h-50 relative">
        <AnimatePresence mode="popLayout">
          {selectedImage === null ? (
            <div className="absolute inset-0">
              <PlaceholderImg />
            </div>
          ) : (
            <motion.img
              draggable={false}
              key={selectedImage}
              src={images[selectedImage ?? 0]}
              alt="Selected Slide"
              className="w-50 h-50 object-cover  absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 2 } }}
              transition={{ duration: 2 }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PlaceholderImg = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.5 }}
      className="w-50 h-50 bg-blue-200 flex items-center justify-center"
    >
      <span className="text-gray-500">Loading...</span>
    </motion.div>
  );
};
