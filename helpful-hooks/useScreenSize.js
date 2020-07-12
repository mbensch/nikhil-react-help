import { useContext, useCallback, useMemo } from 'react';
import { ScreenWidthContext } from './useMedia';
import memoize from 'memoizerific';
import every from 'lodash/every';

const comparator = {
  $eq: (value, actual) => actual === value,
  $lt: (value, actual) => actual < value,
  $gt: (value, actual) => actual > value,
  $lte: (value, actual) => actual <= value,
  $gte: (value, actual) => actual >= value,
};

const evaluateQueries = memoize(1000)((queries, width) =>
  every(queries, (value, compName) => comparator[compName](value, width)),
);

const useScreenSize = () => {
  const width = useContext(ScreenWidthContext);

  const defaultValues = useMemo(
    () => ({
      xs: evaluateQueries({ $lt: 600 }, width),
      sm: evaluateQueries({ $gte: 600, $lt: 960 }, width),
      md: evaluateQueries({ $gte: 960, $lt: 1280 }, width),
      mdlg: evaluateQueries({ $gte: 1280, $lt: 1600 }, width),
      lg: evaluateQueries({ $gte: 1600, $lt: 1920 }, width),
      xl: evaluateQueries({ $gte: 1920, $lt: 2560 }, width),
      xxl: evaluateQueries({ $gte: 2560 }, width),
    }),
    [width],
  );

  const test = useCallback(queries => evaluateQueries(queries, width), [width]);

  return useMemo(() => ({ ...defaultValues, test, width }), [defaultValues, test, width]);
};

export default useScreenSize;
