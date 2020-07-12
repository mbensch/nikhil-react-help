import { useState, useRef, useEffect } from 'react';
import { addEventListener } from 'consolidated-events';

const useHover = () => {
  const [value, setValue] = useState(false);
  const ref = useRef(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      const removeMouseOver = addEventListener(node, 'mouseover', handleMouseOver);
      const removeMouseOut = addEventListener(node, 'mouseout', handleMouseOut);

      return () => {
        removeMouseOut();
        removeMouseOver();
      };
    }
  }, [ref.current]);

  return [ref, value];
};

export default useHover;
