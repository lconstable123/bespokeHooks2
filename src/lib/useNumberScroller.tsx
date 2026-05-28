import { animate, useMotionValue } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

//---scroller for number wheel

export const useNumberScroller = (
  selectedTime: number,
  setSelectedTime: Dispatch<SetStateAction<number>>,
  maxNumbers: number,
  viewPortHeight = 296,
  itemHeight = 44,
) => {
  const hours = Array.from({ length: maxNumbers }, (_, index) => index);
  // Repeat the array more times for smoother infinite scroll
  const repeatCount = 5;
  const repeatedTime = Array.from({ length: repeatCount }).flatMap(() => hours);
  const middleSegment = Math.floor(repeatCount / 2);
  const centerOffset = viewPortHeight / 2 - itemHeight / 2;
  // const [selectedHour, setSelectedHour] = useState(12);
  const segmentHeight = hours.length * itemHeight;
  const baseCycleStart = hours.length;
  const y = useMotionValue(
    centerOffset - (baseCycleStart + selectedTime) * itemHeight,
  );

  useEffect(() => {
    const unsubscribe = y.on("change", (currentY) => {
      const minY = centerOffset - (middleSegment + 1) * segmentHeight;
      const maxY = centerOffset - (middleSegment - 1) * segmentHeight;
      if (currentY < minY) {
        y.set(currentY + segmentHeight * (repeatCount - 2));
      } else if (currentY > maxY) {
        y.set(currentY - segmentHeight * (repeatCount - 2));
      }
    });
    return () => unsubscribe();
  }, [centerOffset, segmentHeight, y, middleSegment]);

  const toPositiveModulo = (value: number, mod: number) =>
    ((value % mod) + mod) % mod;

  const getClosestIndexForHour = (hour: number, referenceIndex: number) => {
    const safeHour = toPositiveModulo(hour, hours.length);
    const candidates = [
      safeHour,
      safeHour + hours.length,
      safeHour + hours.length * 2,
    ];

    return candidates.reduce((closest, current) => {
      return Math.abs(current - referenceIndex) <
        Math.abs(closest - referenceIndex)
        ? current
        : closest;
    }, candidates[0]);
  };

  useEffect(() => {
    const safeHour = toPositiveModulo(selectedTime, hours.length);
    const currentIndex = Math.round((centerOffset - y.get()) / itemHeight);
    const candidates = [
      safeHour,
      safeHour + hours.length,
      safeHour + hours.length * 2,
    ];
    const targetIndex = candidates.reduce((closest, current) => {
      return Math.abs(current - currentIndex) < Math.abs(closest - currentIndex)
        ? current
        : closest;
    }, candidates[0]);
    const targetY = centerOffset - targetIndex * itemHeight;
    y.set(targetY);
  }, [centerOffset, hours.length, itemHeight, selectedTime, y]);

  const snapToTime = (hour: number, referenceIndex?: number) => {
    const safeHour = toPositiveModulo(hour, hours.length);
    const currentIndex = Math.round((centerOffset - y.get()) / itemHeight);
    const targetIndex = getClosestIndexForHour(
      safeHour,
      referenceIndex ?? currentIndex,
    );
    const targetY = centerOffset - targetIndex * itemHeight;
    const nextTime = hours[safeHour];
    setSelectedTime(nextTime);
    animate(y, targetY, { type: "spring", stiffness: 380, damping: 35 });
  };

  const handleWheelDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    _info: PanInfo,
  ) => {
    const currentY = y.get();
    const rawIndex = Math.round((centerOffset - currentY) / itemHeight);
    const wrappedHour = toPositiveModulo(rawIndex, hours.length);
    snapToTime(wrappedHour, rawIndex);
    toast.success(`useNumberScroller loaded successfully! ${wrappedHour}`);
  };

  return { handleWheelDragEnd, repeatedTime, y, snapToTime };
};

//-------- scroller for text wheel

export const useScroller = (
  selectedIndex: number,
  setSelectedIndex: Dispatch<SetStateAction<number>>,
  maxNumbers: number,
  viewPortHeight = 296,
  itemHeight = 44,
  centerOffsetAdjustment = 0,
) => {
  const [isDragging, setIsDragging] = useState(false);
  const hours = Array.from({ length: maxNumbers }, (_, index) => index);
  const repeatedTime = hours;
  const centerOffset =
    viewPortHeight / 2 - itemHeight / 2 + centerOffsetAdjustment;

  const clamp = (value: number) =>
    Math.min(Math.max(value, 0), Math.max(hours.length - 1, 0));
  const y = useMotionValue(centerOffset - clamp(selectedIndex) * itemHeight);

  const snapToTime = (hour: number, referenceIndex?: number) => {
    const targetIndex = clamp(referenceIndex ?? hour);
    const targetY = centerOffset - targetIndex * itemHeight;
    const nextIndex = hours[targetIndex] ?? 0;
    setSelectedIndex(nextIndex);
    animate(y, targetY, { type: "spring", stiffness: 380, damping: 35 });
  };

  const handleWheelDragEnd = (
    _event?: MouseEvent | TouchEvent | PointerEvent,
    _info?: PanInfo,
  ) => {
    const currentY = y.get();
    const rawIndex = Math.round((centerOffset - currentY) / itemHeight);
    const clampedIndex = clamp(rawIndex);
    snapToTime(clampedIndex, clampedIndex);
    setIsDragging(false);
  };

  const handleWheelDragStart = () => {
    setIsDragging(true);
  };

  return {
    handleWheelDragEnd,
    handleWheelDragStart,
    repeatedTime,
    y,
    snapToTime,
    isDragging,
  };
};
