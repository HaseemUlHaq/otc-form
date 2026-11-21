import { useState, useEffect } from 'react';
import { type OTCFormData, initialFormData } from '../types/form';

export function useFormData(pharmacyId: string) {
  const storageKey = `otc-demo-draft:${pharmacyId}`;
  const [formData, setFormData] = useState<OTCFormData>(() => {
    const saved = localStorage.getItem(storageKey);
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
    localStorage.setItem(storageKey, JSON.stringify(formData));
  }, [formData, storageKey]);

  const updateFormData = (updates: Partial<OTCFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const clearFormData = () => {
    setFormData(initialFormData);
    localStorage.removeItem(storageKey);
  };

  return { formData, updateFormData, clearFormData };
}
