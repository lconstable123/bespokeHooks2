import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
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
type tBoxData = {
  set: (values: { opacity: number; x: number; y: number }) => void;
  setVector: (values: {
    angle: number;
    length: number;
    opacity: number;
  }) => void;
  row: number;
  col: number;
};
type tAnimatedGrid = {
  radius: number;
};
type tActiveWaves = {
  animatedRadius: tAnimatedGrid;
  tweenInstance: gsap.core.Tween;
  dx: Float32Array;
  dy: Float32Array;
  dist: Float32Array;
  distFalloff: number;
  invDistFalloffDenom: number;
  strength: { value: number };
  isRetiring: boolean;
};
type tBoxArrayProps = {
  gridSize?: number;
  maxActiveWaves?: number;
  startingOpacity?: number;
  intensity?: number;
  thickness?: number;
  duration?: number;
  fallOffMultiplier?: number;
};
type tBoxArrayOutputs = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  gridSize: number;
  handleBoxClick: (row: number, col: number) => void;
};

export const useArrayWaves = ({
  gridSize = 60,
  maxActiveWaves = 3,
  startingOpacity = 0.1,
  intensity = 1.5,
  thickness = 1.3,
  duration = 3,
  fallOffMultiplier = 0.2,
}: tBoxArrayProps): tBoxArrayOutputs => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boxData = useRef<tBoxData[]>([]);
  const activeWaves = useRef<tActiveWaves[]>([]);

  const retireWave = (wave: tActiveWaves) => {
    if (wave.isRetiring) return;
    wave.isRetiring = true;
    wave.tweenInstance.kill();

    gsap.to(wave.strength, {
      value: 0,
      duration: 0.25,
      ease: "power2.out",
      onUpdate: renderWaves,
      onComplete: () => {
        activeWaves.current = activeWaves.current.filter((w) => w !== wave);
        renderWaves();
      },
    });
  };

  useGSAP(
    () => {
      // sanity check
      // query cubes as allBoxes
      // initial opacity
      // map cubes to assign opacity trigger as BoxData
      // also include col and row

      if (!containerRef.current) return;
      const allBoxes = Array.from(
        containerRef.current.querySelectorAll<HTMLDivElement>(".boxArray-box"),
      );
      gsap.set(allBoxes, { opacity: startingOpacity, x: 0, y: 0 });
      boxData.current = allBoxes.map((box, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const vectorEl = box.querySelector<HTMLDivElement>(".boxArray-vector");
        const setOpacity = gsap.quickSetter(box, "opacity") as (
          value: number,
        ) => void;
        const setX = gsap.quickSetter(box, "x", "px") as (
          value: number,
        ) => void;
        const setY = gsap.quickSetter(box, "y", "px") as (
          value: number,
        ) => void;
        const setVectorRotation = vectorEl
          ? (gsap.quickSetter(vectorEl, "rotation", "deg") as (
              value: number,
            ) => void)
          : null;
        const setVectorScale = vectorEl
          ? (gsap.quickSetter(vectorEl, "scaleX") as (value: number) => void)
          : null;
        const setVectorOpacity = vectorEl
          ? (gsap.quickSetter(vectorEl, "opacity") as (value: number) => void)
          : null;
        return {
          row,
          col,
          set: ({ opacity, x, y }) => {
            setOpacity(opacity);
            setX(x);
            setY(y);
          },
          setVector: ({ angle, length, opacity }) => {
            if (!setVectorRotation || !setVectorScale || !setVectorOpacity)
              return;
            setVectorRotation(angle);
            setVectorScale(length);
            setVectorOpacity(opacity);
          },
        };
      });
    },
    { scope: containerRef },
  );

  const renderWaves = () => {
    // retrieve BoxData and activeWaves from refs
    // loop though each box
    // have compounding energy variable;
    // loop through each wave in activeWaves
    // using radius, distance, waveRadius and thickness calculate the ring energy
    // remember gaussian formula A * exp(-(x-center)^2 / 2*(spread^2)   )
    // using ring Energy and falloffDistance calculate the attenuated energy
    // add the attenuated energy to the compounding energy variable
    // after looping through waves, clamp the compounding energy and set the opacity of the box with the boxData trigger

    const boxDataSnapShot = boxData.current;
    const activeWaveSnapshot = activeWaves.current;
    const waveCount = activeWaveSnapshot.length;
    const boxCount = boxDataSnapShot.length;
    const invThicknessDenom = 1 / (2 * thickness * thickness);
    const ringCullDistance = thickness * 4;
    const ringCullDistanceSq = ringCullDistance * ringCullDistance;
    const displacementStrength = 0.8;
    for (let index = 0; index < boxCount; index++) {
      const { set } = boxDataSnapShot[index];
      let compoundedEnergy = 0;
      let compoundedX = 0;
      let compoundedY = 0;
      for (let waveIndex = 0; waveIndex < waveCount; waveIndex++) {
        const wave = activeWaveSnapshot[waveIndex];
        const dist = wave.dist[index];
        const rad = wave.animatedRadius.radius;
        const ringDelta = dist - rad;
        const ringDeltaSq = ringDelta * ringDelta;
        if (ringDeltaSq > ringCullDistanceSq) {
          continue;
        }

        const waveEnergy = Math.exp(-ringDeltaSq * invThicknessDenom);
        const attenuation =
          waveEnergy *
          Math.exp(-(dist * dist) * wave.invDistFalloffDenom) *
          wave.strength.value;
        const moveXRaw = attenuation * wave.dx[index];
        const moveYRaw = attenuation * wave.dy[index];
        compoundedEnergy += attenuation;
        compoundedX += moveXRaw;
        compoundedY += moveYRaw;
      }
      const clamped = Math.min(1, compoundedEnergy);
      set({
        opacity: startingOpacity + clamped * intensity,
        x: compoundedX * displacementStrength,
        y: compoundedY * displacementStrength,
      });
    }
  };

  const handleBoxClick = (i: number, j: number) => {
    // get allCubes
    // query allBoxData col and row, calculate distances with the hypot
    // create an object with a variable state of { radius: 0 }
    // calculate the max distance for each wave, by getting the furthest edge in y and the furthers edge in y and calualting the hyp
    // gsap animation
    // animate radius to a max distance
    // on update call renderWaves
    // on complete remove the wave from activeWaves and call renderWaves
    // assign a custom animation tween object with
    // distances
    // the tween object
    // object with the animated variable state  = { radius: # }
    // the falloff
    // add the wave to activeWaves
    const liveWaveCount = activeWaves.current.reduce(
      (count, wave) => count + (wave.isRetiring ? 0 : 1),
      0,
    );
    if (liveWaveCount >= maxActiveWaves) {
      const oldestLiveWave = activeWaves.current.find(
        (wave) => !wave.isRetiring,
      );
      if (oldestLiveWave) {
        retireWave(oldestLiveWave);
      }
    }

    const allCubes = boxData.current;
    const boxCount = allCubes.length;
    const maxDist = Math.hypot(
      Math.max(i, gridSize - 1 - i),
      Math.max(j, gridSize - 1 - j),
    );
    const dx = new Float32Array(boxCount);
    const dy = new Float32Array(boxCount);
    const dist = new Float32Array(boxCount);
    for (let index = 0; index < boxCount; index++) {
      const cube = allCubes[index];
      const dirX = cube.col - j;
      const dirY = cube.row - i;
      const distance = Math.hypot(dirX, dirY);
      dx[index] = dirX;
      dy[index] = dirY;
      dist[index] = distance;

      const angle = Math.atan2(dirY, dirX) * (180 / Math.PI);
      const normalizedLength = maxDist > 0 ? distance / maxDist : 0;
      const vectorLength =
        normalizedLength === 0 ? 0 : 0.25 + normalizedLength * 0.75;
      cube.setVector({
        angle,
        length: vectorLength,
        opacity: distance === 0 ? 0 : 0.85,
      });
    }
    const animatedRadius = { radius: 0 };
    const distFalloff = maxDist * fallOffMultiplier;
    const invDistFalloffDenom = 1 / (2 * distFalloff * distFalloff);
    const animationTween = gsap.to(animatedRadius, {
      radius: maxDist + thickness,
      duration,
      onUpdate: renderWaves,
      onComplete: () => {
        activeWaves.current = activeWaves.current.filter(
          (wave) => wave.tweenInstance !== animationTween,
        );
        renderWaves();
      },
    });
    const activeWave: tActiveWaves = {
      animatedRadius,
      tweenInstance: animationTween,
      dx,
      dy,
      dist,
      distFalloff,
      invDistFalloffDenom,
      strength: { value: 1 },
      isRetiring: false,
    };
    activeWaves.current.push(activeWave);
    renderWaves();
  };

  return {
    containerRef,
    gridSize,
    handleBoxClick,
  };
};
