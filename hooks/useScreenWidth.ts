import { useState, useEffect } from 'react';

export const useScreenWidth = (padding: number = 0) => {
  const [ width, setWidth ] = useState(window.innerWidth);

  const setScreenWidth = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', setScreenWidth);

    return(() => window.removeEventListener('resize', setScreenWidth));
  }, [ window.innerWidth ]);

  return width - padding;
};
