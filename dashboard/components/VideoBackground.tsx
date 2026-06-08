"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Seamless looping video via crossfade between two stacked <video> elements.
 * Near the end of the active clip we start the other from 0 and fade across,
 * which hides the hard cut you get from the native `loop` attribute.
 */
export default function VideoBackground({
  src,
  onError,
  fade = 0.7, // seconds of crossfade overlap
}: {
  src: string;
  onError?: () => void;
  fade?: number;
}) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState<"a" | "b">("a");
  const switching = useRef(false);

  useEffect(() => {
    aRef.current?.play().catch(() => {});
  }, []);

  const onTime = (which: "a" | "b") => {
    if (which !== front || switching.current) return;
    const cur = which === "a" ? aRef.current : bRef.current;
    const other = which === "a" ? bRef.current : aRef.current;
    if (!cur || !other || !isFinite(cur.duration)) return;

    if (cur.duration - cur.currentTime <= fade) {
      switching.current = true;
      other.currentTime = 0;
      other.play().catch(() => {});
      setFront(which === "a" ? "b" : "a");
      window.setTimeout(() => {
        switching.current = false;
      }, fade * 1000 + 120);
    }
  };

  const onDone = (which: "a" | "b") => {
    const v = which === "a" ? aRef.current : bRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const common =
    "absolute inset-0 h-full w-full object-cover transition-opacity ease-linear";
  const style = (isFront: boolean) => ({
    opacity: isFront ? 1 : 0,
    transitionDuration: `${fade}s`,
  });

  return (
    <>
      <video
        ref={aRef}
        src={src}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => onTime("a")}
        onEnded={() => onDone("a")}
        onError={onError}
        className={common}
        style={style(front === "a")}
      />
      <video
        ref={bRef}
        src={src}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => onTime("b")}
        onEnded={() => onDone("b")}
        className={common}
        style={style(front === "b")}
      />
    </>
  );
}
