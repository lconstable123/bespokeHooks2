export function smoothScrollTo({
  target,
  duration,
  vel = 0,
  offset = 0,
}: {
  target: HTMLDivElement;
  duration: number;
  vel?: number;
  offset?: number;
}) {
  const windowOffset = window.scrollY;
  const elementOffset = target.getBoundingClientRect().y;
  const targetOffset = windowOffset + elementOffset + offset;
  const distance = targetOffset - windowOffset;

  let startTime: number | null = null;

  function sharpSineEase(t) {
    return Math.pow(-(Math.cos(Math.PI * t) - 1) / 2, 1.5);
  }

  function step(time: number) {
    if (startTime === null) {
      startTime = time;
    }

    const elapsedTime = time - startTime;
    const normalisedTime = Math.min(elapsedTime / duration, 1);

    const increment =
      windowOffset + distance * (sharpSineEase(normalisedTime) * vel);
    window.scrollTo(0, increment);

    if (elapsedTime < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
