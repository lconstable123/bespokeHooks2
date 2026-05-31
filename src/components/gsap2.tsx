useGSAP(() => {
  gsap.to(".box", {
    x: 300,
    rotation: 360,
    duration: 2,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(".box2", {
    y: 100,
    duration: 1,

    repeat: -1,
    yoyo: true,
    ease: "power4",
  });
  gsap.to(".box3", {
    x: -100,
    // rotation: -10,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "rough({ strength: 1, points: 20, taper: none, randomize: false, clamp: false })",
  });

  // gsap.set(".slowEaser", {
  //   transformOrigin: "right center",
  //   x: offscreenStartX,
  //   scaleX: 0.55,
  //   opacity: 0.2,
  // });

  // Create a custom bounce with squash
  CustomBounce.create("myBounce", {
    strength: 0.5,
    endAtStart: true,
    squash: 2,
    squashID: "mySquash",
  });

  // Animate bounce (down)
  gsap.to(".customBouncer", {
    y: 100,
    duration: 2,
    repeat: -1,
    ease: "myBounce",
  });

  // Animate squash and stretch (scaleY)
  gsap.fromTo(
    ".customBouncer",
    { scaleY: 1 }, // squash at bottom
    {
      scaleY: 0.7, // stretch at top
      duration: 2,
      repeat: -1,
      ease: "mySquash",
    },
  );
}, []);

// function BoxArray() {
//   const { gridSize, handleBoxClick, containerRef } = useArrayWaves({
//     gridSize: 60,
//     maxActiveWaves: 3,
//     startingOpacity: 0.5,
//     intensity: 1.5,
//     thickness: 1.3,
//     duration: 3,
//     fallOffMultiplier: 0.2,
//   });

//   const boxArray = Array.from({ length: gridSize }, (_, i) => i);
//   return (
//     <div
//       ref={containerRef}
//       className="boxArray-container grid border-4 p-1 rounded-sm border-yellow-500  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 "
//       style={{
//         gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
//         gridTemplateRows: `repeat( ${gridSize}, 1fr)`,
//       }}
//     >
//       {boxArray.map((_, i) =>
//         boxArray.map((_, j) => (
//           <div
//             onClick={() => {
//               handleBoxClick(i, j);
//             }}
//             key={i.toString() + j.toString()}
//             className="    "
//           >
//             <div className="boxArray-box relative aspect-square m-[2px] rounded-[4px] bg-yellow-500 opacity-20">
//               <div className="boxArray-vector pointer-events-none absolute left-1/2 top-1/2 h-[2px] w-[12px] -translate-y-1/2 origin-left bg-red-700 opacity-0" />
//             </div>
//           </div>
//         )),
//       )}
//     </div>
//   );
// }

{
  /* <div className="absolute top-10 flex gap-5 left-10 border-2 w-100 h-34">
        <div className="w-10 h-10 bg-amber-600" />
        <div className="w-10 h-10 bg-amber-600" />

        <div className=" basis-20 flex-grow-50 bg-amber-600" />
        <div className="w-10 h-10 bg-amber-600" />
      </div> */
}

{
  /* <div className="box absolute top-100 left-100 h-10 w-10  bg-red-500" />
      <div className="box2 absolute bottom-10 left-200 h-10 w-10 bg-blue-500" />
      <div className="box3 absolute bottom-10 left-40 h-50 w-50  bg-blue-100" />
      <div className="customBouncer absolute origin-top left-100 bottom-80 h-20 w-20 bg-green-500 rounded-full" />
      <div className="slowEaser absolute top-10 -left-100  h-2 w-100 bg-black/20" />
      <div className="slowEaser absolute top-14 -left-100  h-2 w-100 bg-black/20" />
      <div className="slowEaser absolute top-18 -left-100  h-2 w-100 bg-black/20" /> */
}
