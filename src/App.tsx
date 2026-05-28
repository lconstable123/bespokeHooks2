import { useRef, useState } from "react";
import type { CarouselApi } from "./components/ui/carousel";
import { CustomCarousel } from "./components/custom-carousel";

function App() {
  const [api, setApi] = useState<CarouselApi>();
  const handleCarouselNext = () => {
    if (api) {
      api.scrollNext();
      api.slidesInView();
    }
  };
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-amber-300">
      <button
        onClick={handleCarouselNext}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded fixed top-4 left-4 z-10"
      >
        Next
      </button>
      <button
        onClick={() => {
          if (api) {
            api.scrollTo(0);
          }
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded fixed top-20 left-4 z-10"
      >
        Reset
      </button>
      <CustomCarousel api={api} setApi={setApi} />
    </div>
  );
}

export default App;
