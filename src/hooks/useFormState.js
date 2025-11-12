// src/hooks/useFormState.js
import { useState, useCallback } from 'react';

export const useFormState = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleFormChange = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  return {
    formData,
    handleFormChange,
    resetForm,
    setFormData
  };
};