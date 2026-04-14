import React, { useRef } from "react";

type Direction = "top" | "bottom";

type InfiniteScrollContainerProps = {
  children: React.ReactNode;

  fetchNextPage: () => Promise<any> | void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;

  direction?: Direction;

  threshold?: number;

  className?: string;
  style?: React.CSSProperties;
};

export default function InfiniteScrollContainer({
  children,
  fetchNextPage,
  hasNextPage = false,
  isFetchingNextPage = false,
  direction = "top",
  threshold = 50,
  className,
  style,
}: InfiniteScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeight = useRef<number>(0);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    // TOP direction
    if (direction === "top") {
      if (el.scrollTop <= threshold) {
        if (!hasNextPage || isFetchingNextPage) return;

        prevScrollHeight.current = el.scrollHeight;

        await fetchNextPage();

        requestAnimationFrame(() => {
          if (!containerRef.current) return;

          const newScrollHeight = containerRef.current.scrollHeight;

          // preserve scroll position
          containerRef.current.scrollTop =
            newScrollHeight - prevScrollHeight.current;
        });
      }
    }

    // BOTTOM direction
    if (direction === "bottom") {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

      if (isNearBottom) {
        if (!hasNextPage || isFetchingNextPage) return;
        await fetchNextPage();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={className}
      style={{
        overflowY: "auto",
        display: "flex",
        flexDirection: direction === "top" ? "column-reverse" : "column",
        height: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
