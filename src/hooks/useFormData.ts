import { useState, useEffect } from 'react';
import { type OTCFormData, initialFormData } from '../types/form';

const STORAGE_KEY = 'otc-form-data';

export function useFormData() {
  const [formData, setFormData] = useState<OTCFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialFormData;
      }
    }
    return initialFormData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (updates: Partial<OTCFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const clearFormData = (preservePharmacy: boolean = false) => {
    const newData = preservePharmacy 
      ? { ...initialFormData, pharmacy: formData.pharmacy }
      : initialFormData;
    setFormData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  return { formData, updateFormData, clearFormData };
}
