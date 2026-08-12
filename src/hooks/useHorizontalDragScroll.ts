import { useEffect, useRef, useState } from "react";

export function useHorizontalDragScroll<T extends HTMLElement>(deps: unknown[] = []) {
  const scrollRef = useRef<T>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollStart: 0 });

  const checkScrollPosition = () => {
    const slider = scrollRef.current;
    if (!slider) return;
    const absScroll = Math.abs(slider.scrollLeft);
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    setAtStart(absScroll <= 2);
    setAtEnd(absScroll >= maxScroll - 2);
  };

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    checkScrollPosition();
    slider.addEventListener("scroll", checkScrollPosition, { passive: true });
    return () => slider.removeEventListener("scroll", checkScrollPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const scrollBy = (direction: "left" | "right", amount = 350) => {
    scrollRef.current?.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;
    dragState.current = { isDown: true, startX: e.pageX - slider.offsetLeft, scrollStart: slider.scrollLeft };
  };
  const handleMouseLeave = () => { dragState.current.isDown = false; };
  const handleMouseUp = () => { dragState.current.isDown = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider || !dragState.current.isDown) return;
    e.preventDefault();
    const walk = (e.pageX - slider.offsetLeft - dragState.current.startX) * 1.5;
    slider.scrollLeft = dragState.current.scrollStart - walk;
  };

  return {
    scrollRef, atStart, atEnd, scrollBy,
    dragHandlers: { onMouseDown: handleMouseDown, onMouseLeave: handleMouseLeave, onMouseUp: handleMouseUp, onMouseMove: handleMouseMove },
  };
}