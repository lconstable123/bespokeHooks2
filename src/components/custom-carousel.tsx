import { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { type CarouselApi } from "@/components/ui/carousel";

export function CustomCarousel({
  api,
  setApi,
}: {
  api?: CarouselApi;
  setApi?: React.Dispatch<React.SetStateAction<CarouselApi | undefined>>;
}) {
  const ref = useRef(null);
  //      const handleCarouselNext = () => {
  //     if (api) {
  //       api.scrollNext();
  //       api.slidesInView();
  //    api.scrollTo(0);
  //     }
  //   };

  const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start bg-amber-300">
      <div
        className="w-full h-screen flex flex-col items-center justify-center bg-amber-300"
        ref={ref}
      >
        <Carousel
          className="w-300 border-2 h-[100px] bg-amber-500 rounded-lg"
          orientation="horizontal"
          setApi={setApi}
          opts={{
            containScroll: "trimSnaps",
            align: "center",
            loop: true,
            skipSnaps: false,
          }}
        >
          <CarouselContent className="h-full gap-10 px-10 m-0  ">
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className="bg-amber-700 h-full w-full  text-white flex items-center justify-center  rounded-lg basis-[calc((100%-2.5rem)/3)] "
              >
                {item}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
