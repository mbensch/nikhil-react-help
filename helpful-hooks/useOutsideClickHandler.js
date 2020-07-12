import { useEffect, useRef } from 'react';
import { addEventListener } from 'consolidated-events';

export default callback => {
  const ref = useRef(null);

  const handleClick = e => {
    const isOutside = ref.current && !ref.current.contains(e.target);

    if (isOutside) {
      callback(e);
    }
  };

  useEffect(
    () =>
      // addEventLister returns a function that will remove the event listener.
      // This will cause this hook to automatically cleanup after itself.
      // https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect
      addEventListener(document, 'click', handleClick, {
        capture: true,
      }),
    [ref.current, callback],
  );

  return ref;
};
