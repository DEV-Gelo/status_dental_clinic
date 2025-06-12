"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
// ----------Import React icons----------//
import { RiArrowRightSFill, RiArrowLeftSFill } from "react-icons/ri";

export const Slider = ({ Before, After, priority = false }) => {
  const [sliderPosition, setSliderPosition] = useState(49);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  // Translation
  const t = useTranslations("Slider");

  const updateSliderPosition = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    // Bounce when reaching the edge
    setSliderPosition((prev) => {
      if (prev <= 1) return 5;
      if (prev >= 99) return 95;
      return prev;
    });
  };

  // Mouse event
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) updateSliderPosition(e.clientX);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  // Touch event
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDragging) updateSliderPosition(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className="w-full relative">
      <div
        ref={containerRef}
        className="relative w-full max-w-[700px] aspect-[70/45] m-auto overflow-hidden select-none touch-none"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {sliderPosition < 95 ? (
          <p className="absolute top-2 right-4 z-10 text-[1.2rem] text-[#f5f5f570] font-semibold">
            {t("After")}
          </p>
        ) : null}
        {sliderPosition > 5 ? (
          <p className="absolute top-2 left-4 z-10 text-[1.2rem] text-[#f5f5f570] font-semibold">
            {t("Before")}
          </p>
        ) : null}

        {/* After image */}
        <Image
          alt="After"
          draggable={false}
          src={After}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Before image */}
        <div
          className="absolute top-0 left-0 right-0 w-full max-w-[700px] aspect-[70/45] m-auto overflow-hidden select-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            transition: isDragging ? "none" : "clip-path 0.3s ease-out",
          }}
        >
          <Image
            draggable={false}
            alt="Before"
            src={Before}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#006eff] cursor-ew-resize"
          style={{
            left: `calc(${sliderPosition}% - 1px)`,
            transition: isDragging ? "none" : "left 0.3s ease-out",
          }}
        >
          <div className="flex justify-center items-center bg-white absolute border-[#006eff] border-2 rounded-full h-8 w-8 -left-[14px] top-[calc(50%-16px)]">
            <span className="flex text-[1.5rem] blue-text">
              <RiArrowLeftSFill className="absolute -left-[11px] top-[3px] ml-2" />
              <RiArrowRightSFill className="absolute -right-[11px] top-[3px] mr-2" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
