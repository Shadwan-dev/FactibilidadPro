// src/hooks/useFinancialTranslations.js
import { useMemo } from 'react';
import { translations } from '../utils/translations';

export const useFinancialTranslations = (language = 'es') => {
  const t = useMemo(() => {
    return translations[language] || translations.es;
  }, [language]);

  return t;
};