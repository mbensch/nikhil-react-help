import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

const useValidatedFormField = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const debouncedValue = useDebounce(value, 500);

  const validate = () => {
    if (validator) {
      const { valid, message } = validator(value);
      setIsValid(valid);
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    if (debouncedValue !== initialValue) {
      validate();
    }
  }, [debouncedValue]);

  return [value, setValue, validate, isValid, errorMessage];
};

export default useValidatedFormField;
