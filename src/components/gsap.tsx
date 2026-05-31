import { useGridAnimation } from "@/lib/useArrayWaves";

export function GsapTests() {
  return (
    <div className="w-screen h-screen absolute bg-amber-300 border-6 border-black overflow-hidden">
      <BoxArray />
    </div>
  );
}

function BoxArray() {
  const gridSize = 20;
  const gridItems = Array.from({ length: gridSize }, (_, i) => i);

  const { containerRef, handlePress } = useGridAnimation({ gridSize });

  return (
    <div
      ref={containerRef}
      className="boxArray grid gap-1 border-2 p-5 border-amber-200 w-180 h-180 rounded-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {gridItems.map((_, i) =>
        gridItems.map((_, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => {
              // toast.success(`row: ${i}, col: ${j}`);
              handlePress(i, j);
            }}
            className="boxArray-box relative   bg-amber-200 rounded-[2px]"
          >
            {/* <div className="debug-line absolute top-1/2 direction-helper w-full h-[2px] bg-yellow-600" /> */}
          </div>
        )),
      )}
    </div>
  );
}
