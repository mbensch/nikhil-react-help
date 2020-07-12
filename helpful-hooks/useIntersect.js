import { useRef, useEffect } from 'react';
import 'intersection-observer';

const useIntersect = (callback, options) => {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => callback(entry));
    }, options);

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return ref;
};

export default useIntersect;
