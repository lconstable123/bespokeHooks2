import { useEffect, useRef, useState } from "react";
import type { CarouselApi } from "./components/ui/carousel";
import { CustomCarousel } from "./components/custom-carousel";
import { animate, useInView, useScroll } from "framer-motion";
import toast from "react-hot-toast";
import { smoothScrollTo } from "./lib/smoothScrollTo";

function App() {
  const scrollToElement = useRef<HTMLDivElement>(null);
  const handleScrollTo = () => {
    if (scrollToElement.current) {
      scrollToElement.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleScrollTo2 = () => {
    if (scrollToElement.current) {
      smoothScrollTo({
        target: scrollToElement.current,
        duration: 700,
        vel: 1,
        offset: -100,
      });
    }
  };

  const isInView = useInView(scrollToElement, {
    margin: "-100px 0px -100px 0px",
  });

  const { ElementscrollY, ElementscrollYProgress } = useScroll({
    target: scrollToElement,
    offset: ["start end", "end start"],
  });

  const { scrollY: PageScrollY } = useScroll();

  useEffect(() => {
    if (isInView) {
      toast.success("Element is in view!");
    } else {
      toast.error("Element is out of view!");
    }
  }, [isInView]);

  return (
    <div className="w-full h-2000 flex flex-col items-center justify-start bg-amber-300">
      <button
        className="mb-4 px-4 py-2 fixed top-20 left-10 bg-blue-500 text-white rounded"
        onClick={handleScrollTo}
      >
        scroll to
      </button>
      <button
        className="mb-4 px-4 py-2 fixed top-20 left-50 bg-blue-500 text-white rounded"
        onClick={handleScrollTo2}
      >
        slow scroll to
      </button>
      <div className="w-20 h-10 flex flex-col items-center justify-center mt-200 bg-amber-100" />
      <div
        ref={scrollToElement}
        className="w-20 h-10 flex flex-col items-center justify-center mt-200 bg-amber-600"
      />
    </div>
  );
}

export default App;
