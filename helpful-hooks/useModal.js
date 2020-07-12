import { useState } from 'react';

const useModal = (initialValue = false) => {
  const [modalVisible, setVisibility] = useState(initialValue);

  const openModal = () => setVisibility(true);
  const closeModal = () => setVisibility(false);

  return [modalVisible, openModal, closeModal];
};

export default useModal;
