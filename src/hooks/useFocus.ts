import { useEffect } from 'react';

export default function useFocus(onFocus: any) {
  useEffect(() => {
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('focus', onFocus);
    };
  });
}
