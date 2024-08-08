import { RefObject } from "react";

export const isAtBottom = (ref: RefObject<any>) => {
  return (
    ref.current.scrollHeight - Math.round(ref.current.scrollTop) ===
    ref.current.clientHeight
  );
};

export const isElementInViewport = (
  element: HTMLDivElement,
  container: HTMLDivElement
) => {
  const rect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    rect.top >= containerRect.top &&
    rect.left >= containerRect.left &&
    rect.bottom <= containerRect.bottom &&
    rect.right <= containerRect.right
  );
};

export const scrollElementToBottom = (ref: RefObject<any>) => {
  ref.current.scrollTop = ref.current.scrollHeight;
};
