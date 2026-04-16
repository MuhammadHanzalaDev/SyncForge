import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

type Direction = "top" | "bottom";

export type InfiniteScrollContainerHandle = {
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  getElement: () => HTMLDivElement | null;
};

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

const InfiniteScrollContainer = forwardRef<
  InfiniteScrollContainerHandle,
  InfiniteScrollContainerProps
>(function InfiniteScrollContainer(
  {
    children,
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage = false,
    direction = "top",
    threshold = 100,
    className,
    style,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeight = useRef<number>(0);
  const prevScrollTop = useRef<number>(0);
  const shouldRestoreScroll = useRef<boolean>(false);
  const hasInitializedRef = useRef<boolean>(false);

  useImperativeHandle(ref, () => ({
    scrollToBottom: (behavior: ScrollBehavior = "smooth") => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior });
    },
    getElement: () => containerRef.current,
  }));

  // On first mount, jump to bottom (for "top" direction — chat style)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasInitializedRef.current) return;
    if (direction === "top") {
      el.scrollTop = el.scrollHeight;
    }
    hasInitializedRef.current = true;
  }, [direction]);

  // Restore scroll position after new page of older messages is prepended
  useEffect(() => {
    if (!shouldRestoreScroll.current) return;
    const el = containerRef.current;
    if (!el) return;

    const newScrollHeight = el.scrollHeight;
    const heightDiff = newScrollHeight - prevScrollHeight.current;
    el.scrollTop = prevScrollTop.current + heightDiff;
    shouldRestoreScroll.current = false;
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    if (!hasNextPage || isFetchingNextPage) return;

    if (direction === "top") {
      if (el.scrollTop <= threshold) {
        // Save current state BEFORE fetching
        prevScrollHeight.current = el.scrollHeight;
        prevScrollTop.current = el.scrollTop;
        shouldRestoreScroll.current = true;
        fetchNextPage();
      }
    } else {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
      if (isNearBottom) {
        fetchNextPage();
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
        overflowX: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
});

export default InfiniteScrollContainer;
