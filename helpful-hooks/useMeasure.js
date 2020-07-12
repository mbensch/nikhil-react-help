import { useRef, useState, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';
import ResizeObserver from 'resize-observer-polyfill';

export default function useMeasure(delay = 250) {
  const observer = useRef(null);
  const element = useRef(null);
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  // Set up event handler
  const resizeChange = useMemo(() => {
    const callback = ([entry]) => setRect(entry.contentRect);
    return delay > 0 ? debounce(callback, delay) : callback;
  }, [delay]);

  // Initialize a new observer
  useEffect(() => {
    if (!element.current) return;

    observer.current = new ResizeObserver(resizeChange);
    observer.current.observe(element.current);

    return () => observer.current.disconnect();
  }, [element.current]);

  return [element, rect];
}
