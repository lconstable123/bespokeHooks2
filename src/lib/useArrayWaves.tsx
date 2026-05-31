import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import toast from "react-hot-toast";

type tGAProps = {
  gridSize: number;
  intensity?: number;
  duration?: number;
  falloff?: number;
  ringWidth: number;
  initialOpacity?: number;
};
type tGAOutputs = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  handlePress: (i: number, j: number) => void;
};

type BoxInfo = {
  row: number;
  col: number;
  set: (x: number, y: number, o: number) => void;
};

type AnimationWave = {
  animatedRadius: { radius: number };
  dist: Float32Array;
  dirX: Float32Array;
  dirY: Float32Array;
  animationReference: any;
};

export const useGridAnimation = ({
  gridSize = 20,
  initialOpacity = 0.7,
  ringWidth = 2,
  intensity = 1,
  duration = 2,
  falloff = 3,
}: tGAProps): tGAOutputs => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boxInfo = useRef<BoxInfo[]>([]);
  const animatedWaves = useRef<AnimationWave[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const boxes = Array.from(
        containerRef.current.querySelectorAll<HTMLDivElement>(".boxArray-box"),
      );

      boxInfo.current = boxes.map((box, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const setX = gsap.quickSetter(box, "x", "px");
        const setY = gsap.quickSetter(box, "y", "px");
        const setO = gsap.quickSetter(box, "opacity");

        const set = (x: number, y: number, o: number) => {
          setX(x);
          setY(y);
          setO(o);
        };

        set(0, 0, initialOpacity);
        return { row, col, set };
      });
    },
    { scope: containerRef },
  );

  const clickDebug = (i: number, j: number) => {
    toast.success(`row: ${i}, col: ${j}`);
    boxInfo.current.forEach(({ row, col, set }) => {
      if (row === i && col === j) {
        set(0, 0, 1);
      } else {
        set(0, 0, initialOpacity);
      }
    });
  };

  const handlePress = (i: number, j: number) => {
    // clickDebug( i, j);
    // query row and col
    // gnerate a box object that containers per-frame informations
    // radius(aniamted), distance from click,
    //and the animatin handle
    const boxAmt = boxInfo.current.length;
    const dist = new Float32Array(boxAmt);
    const dirY = new Float32Array(boxAmt);
    const dirX = new Float32Array(boxAmt);

    //for loop though each box and assign.
    for (let boxIndex = 0; boxIndex < boxAmt; boxIndex++) {
      const { row, col } = boxInfo.current[boxIndex];
      const rawX = row - i;
      const rawY = col - j;
      const distance = Math.sqrt(rawX * rawX + rawY * rawY);
      dist[boxIndex] = distance;

      //normalised direciton
      dirY[boxIndex] = rawX === 0 ? 0 : rawX / distance;
      dirX[boxIndex] = rawY === 0 ? 0 : rawY / distance;
    }

    const maxRadius = Math.hypot(
      Math.max(i, gridSize - 1 - i),
      Math.max(j, gridSize - 1 - j),
    );

    const animatedRadius = { radius: 0 };

    const animationReference = gsap.to(animatedRadius, {
      radius: maxRadius + ringWidth,
      duration: duration,
      ease: "none",
      onStart: render,
      //   onUpdate: render,
      onComplete: () => {},
    });

    const waveObject: AnimationWave = {
      animatedRadius,
      dist,
      dirX,
      dirY,
      animationReference,
    };

    animatedWaves.current.push(waveObject);
  };

  const render = () => {
    //declare an accmulated energy var

    const boxes = boxInfo.current;
    const boxAmt = boxes.length;
    const waves = animatedWaves.current;
    const wavesAmt = waves.length;

    let accumulatedEnergy = 0;

    for (let boxIndex = 0; boxIndex < boxAmt; boxIndex++) {
      const { set } = boxes[boxIndex];
      for (let waveIndex = 0; waveIndex < wavesAmt; waveIndex++) {
        const { animatedRadius, dist, dirX, dirY } = waves[waveIndex];
        //calulate roation from dirx and y atan2
        // const rot =
        //   Math.atan2(dirY[boxIndex], dirX[boxIndex]) * (180 / Math.PI);
        // set(0, 0, dist[boxIndex] * 0.1, rot);
        // work out the blurred energy of each square, by chekcing against the distance from the click
        // add a falloff factor
        // add to the accululated energy
        // use the boxinfo setters
        //ok!!
      }
    }
  };

  return { containerRef, handlePress };
};
