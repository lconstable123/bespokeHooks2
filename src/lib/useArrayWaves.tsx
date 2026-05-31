import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import toast from "react-hot-toast";

type tGAProps = {
  gridSize: number;
  intensity?: number;
  duration?: number;
  falloff?: number;
  ringWidth?: number;
  displaceIntensity?: number;
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
  inverseSpreadDenomonatorSq: number;
  inverseRingSpreadDenomonatorSq: number;
  animationReference: any;
};

export const useGridAnimation = ({
  gridSize = 20,
  initialOpacity = 0.3,
  ringWidth = 1,
  intensity = 0.6,
  duration = 1,
  falloff = 3,
  displaceIntensity = 1,
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

  const handlePress = (i: number, j: number) => {
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
      dirY[boxIndex] = distance === 0 ? 0 : rawX / distance;
      dirX[boxIndex] = distance === 0 ? 0 : rawY / distance;
    }

    const maxRadius = Math.hypot(
      Math.max(i, gridSize - 1 - i),
      Math.max(j, gridSize - 1 - j),
    );
    const spreadRadius = maxRadius + ringWidth;
    const inverseSpreadDenomonatorSq = 1 / (2 * spreadRadius * spreadRadius);
    const inverseRingSpreadDenomonatorSq = 1 / (2 * ringWidth * ringWidth);
    const animatedRadius = { radius: 0 };

    const animationReference = gsap.to(animatedRadius, {
      radius: maxRadius + ringWidth,
      duration: duration,
      //   ease: "none",
      //   onStart: render,
      onUpdate: render,
      onComplete: () => {
        // remove the wave from the array
      },
    });

    const waveObject: AnimationWave = {
      animatedRadius,
      dist,
      dirX,
      dirY,
      animationReference,
      inverseSpreadDenomonatorSq,
      inverseRingSpreadDenomonatorSq,
    };

    animatedWaves.current.push(waveObject);
    render();
  };

  const render = () => {
    const boxes = boxInfo.current;
    const boxAmt = boxes.length;
    const waves = animatedWaves.current;
    const wavesAmt = waves.length;

    for (let boxIndex = 0; boxIndex < boxAmt; boxIndex++) {
      let accumulatedEnergy = 0;
      let displaceX = 0;
      let displaceY = 0;
      const { set } = boxes[boxIndex];
      for (let waveIndex = 0; waveIndex < wavesAmt; waveIndex++) {
        const {
          animatedRadius,
          dist,
          dirX,
          dirY,
          inverseSpreadDenomonatorSq,
          inverseRingSpreadDenomonatorSq,
        } = waves[waveIndex];
        const distance = dist[boxIndex];
        const { radius } = animatedRadius;
        //====================================================================
        // gaussian distribution formula =
        // A * Math.exp(-(radius-distance)^2 / 2 * spread ^2)
        //=====================================================================

        const distanceDeltaSq = (distance - radius) * (distance - radius);
        const energy = Math.exp(
          -distanceDeltaSq * inverseRingSpreadDenomonatorSq,
        );
        const attenuatedEnergy =
          energy *
          Math.exp(-(distance * distance) * inverseSpreadDenomonatorSq);

        accumulatedEnergy += attenuatedEnergy;

        // add a falloff factor
        // add to the accululated energy
        // use the boxinfo setters
        //ok!!
        displaceX +=
          dirX[boxIndex] * accumulatedEnergy * displaceIntensity * 20;
        displaceY +=
          dirY[boxIndex] * accumulatedEnergy * displaceIntensity * 20;
      }
      const clampedEnergy = Math.min(1, accumulatedEnergy);
      set(displaceX, displaceY, initialOpacity + clampedEnergy * intensity);
    }
  };

  return { containerRef, handlePress };
};
