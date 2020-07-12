import { useState, useEffect } from 'react';
import { addEventListener } from 'consolidated-events';

const useScrollDirection = () => {
  const [direction, setDirection] = useState(null);
  let scrollPos = 0;

  useEffect(
    () =>
      addEventListener(window, 'scroll', () => {
        const newScrollPos = document.body.getBoundingClientRect().top;

        // Scroll position can be > 0 when you over-scroll up on IOS devices
        if (newScrollPos <= 0) {
          if (newScrollPos > scrollPos) {
            setDirection('UP');
          } else if (newScrollPos < scrollPos) {
            setDirection('DOWN');
          }
          scrollPos = document.body.getBoundingClientRect().top;
        }
      }),
    [],
  );

  return direction;
};

export default useScrollDirection;
