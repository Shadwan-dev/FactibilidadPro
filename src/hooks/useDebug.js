// src/hooks/useDebug.js
import { useEffect, useRef } from 'react';

export const useDebug = (name, value) => {
  const previousValue = useRef();
  
  useEffect(() => {
    if (previousValue.current !== value) {
      console.log(`🔍 ${name}:`, value);
      previousValue.current = value;
    }
  }, [name, value]);
};