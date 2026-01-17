import { useState } from 'react';
import type { MedicationCategory, Medication } from '../data/medications';
import type { CategoryData, SelectedMedication, OtherMedication } from '../types/form';
import type { ReactElement } from 'react';

interface CategoryAccordionProps {
  category: MedicationCategory;
  data: CategoryData;
  onUpdate: (data: CategoryData) => void;
}

const iconComponents: Record<string, ReactElement> = {
  droplets: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplets h-5 w-5 text-red-500">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
    </svg>
  ),
  'circle-alert': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert h-5 w-5 text-red-500">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" x2="12" y1="8" y2="12"></line>
      <line x1="12" x2="12.01" y1="16" y2="16"></line>
    </svg>
  ),
  bandage: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bandage h-5 w-5 text-red-500">
      <path d="M10 10.01h.01"></path>
      <path d="M10 14.01h.01"></path>
      <path d="M14 10.01h.01"></path>
      <path d="M14 14.01h.01"></path>
      <path d="M18 6v11.5"></path>
      <path d="M6 6v12"></path>
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    </svg>
  ),
  droplet: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplet h-5 w-5 text-red-500">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
    </svg>
  ),
  wind: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wind h-5 w-5 text-red-500">
      <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
      <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
      <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
    </svg>
  ),
  eye: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-5 w-5 text-red-500">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-5 w-5 text-red-500">
      <path d="M5 12h14"></path>
      <path d="M12 5v14"></path>
    </svg>
  ),
  activity: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity h-5 w-5 text-red-500">
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
    </svg>
  ),
  sparkles: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-5 w-5 text-red-500">
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
      <path d="M20 2v4"></path>
      <path d="M22 4h-4"></path>
      <circle cx="4" cy="20" r="2"></circle>
    </svg>
  ),
  heart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart h-5 w-5 text-red-500">
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
    </svg>
  ),
  ellipsis: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis h-5 w-5 text-red-500">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="19" cy="12" r="1"></circle>
      <circle cx="5" cy="12" r="1"></circle>
    </svg>
  ),
};

export function CategoryAccordion({ category, data, onUpdate }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMedication = (medication: Medication) => {
    const existing = data.selectedMedications.find((m) => m.medicationId === medication.id);
    if (existing) {
      onUpdate({
        ...data,
        selectedMedications: data.selectedMedications.filter((m) => m.medicationId !== medication.id),
      });
    } else {
      onUpdate({
        ...data,
        selectedMedications: [
          ...data.selectedMedications,
          {
            medicationId: medication.id,
            medicationName: medication.name,
            strength: medication.strengths?.[0],
            form: medication.forms?.[0],
          },
        ],
      });
    }
  };

  const updateMedication = (medicationId: string, updates: Partial<SelectedMedication>) => {
    onUpdate({
      ...data,
      selectedMedications: data.selectedMedications.map((m) =>
        m.medicationId === medicationId ? { ...m, ...updates } : m
      ),
    });
  };

  const clearAll = () => {
    onUpdate({
      selectedMedications: [],
      otherMedications: [],
    });
  };

  const addOther = () => {
    const newOther: OtherMedication = {
      id: Date.now().toString(),
      name: '',
    };
    onUpdate({
      ...data,
      otherMedications: [...data.otherMedications, newOther],
    });
  };

  const removeOther = (id: string) => {
    onUpdate({
      ...data,
      otherMedications: data.otherMedications.filter((o) => o.id !== id),
    });
  };

  const updateOther = (id: string, updates: Partial<OtherMedication>) => {
    const updatedOtherMedications = data.otherMedications.map((o) => (o.id === id ? { ...o, ...updates } : o));
    
    const selectedMedicationId = `other-${id}`;
    const isSelected = data.selectedMedications.some((m) => m.medicationId === selectedMedicationId);
    
    let updatedSelectedMedications = data.selectedMedications;
    if (isSelected) {
      const updatedOther = updatedOtherMedications.find((o) => o.id === id);
      updatedSelectedMedications = data.selectedMedications.map((m) =>
        m.medicationId === selectedMedicationId
          ? {
              ...m,
              medicationName: updatedOther?.name || '',
              quantity: updatedOther?.quantity,
              notes: updatedOther?.notes,
            }
          : m
      );
    }
    
    onUpdate({
      ...data,
      otherMedications: updatedOtherMedications,
      selectedMedications: updatedSelectedMedications,
    });
  };

  const hasSelections = data.selectedMedications.length > 0 || data.otherMedications.length > 0;

  return (
    <div className="last:border-b-0 rounded-lg bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md text-left text-sm font-medium outline-none cursor-pointer focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 px-6 py-4 hover:bg-slate-50 transition-colors w-full"
      >
        <div className="flex items-center gap-3">
          {iconComponents[category.icon] || (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide h-5 w-5 text-red-500">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            </svg>
          )}
          <span className="uppercase tracking-wide">{category.name}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 pb-4 pt-0">
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={clearAll}
                disabled={!hasSelections}
                style={{ backgroundColor: hasSelections ? '#ef4444' : undefined }}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-[3px] text-white bg-red-600 h-8 gap-1.5 px-3 rounded-full"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-4">
              {category.medications.map((medication) => {
                const selected = data.selectedMedications.find((m) => m.medicationId === medication.id);
                return (
                  <div key={medication.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      <div className="lg:col-span-4 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={`med-${medication.id}`}
                          checked={!!selected}
                          onChange={() => toggleMedication(medication)}
                          className="mt-1 size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] border-red-300"
                        />
                        <label htmlFor={`med-${medication.id}`} className="cursor-pointer">
                          <div>{medication.name}</div>
                        </label>
                      </div>

                      {medication.strengths && medication.strengths.length > 0 && (
                        <div className="lg:col-span-2">
                          <select
                            value={selected?.strength || ''}
                            onChange={(e) => updateMedication(medication.id, { strength: e.target.value })}
                            disabled={!selected}
                            style={{ backgroundColor: selected ? 'white' : undefined }}
                            className="data-[placeholder]:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 h-9"
                          >
                            {medication.strengths.map((strength) => (
                              <option key={strength} value={strength}>
                                {strength}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {medication.forms && medication.forms.length > 0 && (
                        <div className="lg:col-span-2">
                          <select
                            value={selected?.form || ''}
                            onChange={(e) => updateMedication(medication.id, { form: e.target.value })}
                            disabled={!selected}
                            style={{ backgroundColor: selected ? 'white' : undefined }}
                            className="data-[placeholder]:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 h-9"
                          >
                            {medication.forms.map((form) => (
                              <option key={form} value={form}>
                                {form}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="lg:col-span-4">
                        <input
                          type="text"
                          value={selected?.other || ''}
                          onChange={(e) => updateMedication(medication.id, { other: e.target.value })}
                          placeholder="Other"
                          disabled={!selected}
                          style={{ backgroundColor: selected ? 'white' : undefined }}
                          className="flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                      </div>
                    </div>
                    {selected && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
                        <div className="lg:col-span-3">
                          <label className="block mb-1">Quantity</label>
                          <input
                            type="text"
                            value={selected.quantity || ''}
                            onChange={(e) => updateMedication(medication.id, { quantity: e.target.value })}
                            placeholder="(Type in)"
                            style={{ backgroundColor: 'white' }}
                            className="flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground md:text-sm"
                          />
                        </div>
                        <div className="lg:col-span-9">
                          <label className="block mb-1">Used for / Notes</label>
                          <textarea
                            value={selected.notes || ''}
                            onChange={(e) => updateMedication(medication.id, { notes: e.target.value })}
                            placeholder="(Type in)"
                            rows={3}
                            style={{ backgroundColor: 'white' }}
                            className="resize-none placeholder:text-muted-foreground flex field-sizing-content w-full rounded-md px-3 py-2 text-base transition-[color,box-shadow] outline-none md:text-sm min-h-[80px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="space-y-3">
              {data.otherMedications.map((other) => {
                const selected = data.selectedMedications.find((m) => m.medicationId === `other-${other.id}`);
                return (
                  <div key={other.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <input
                        type="checkbox"
                        id={`med-other-${other.id}`}
                        checked={!!selected}
                        onChange={() => {
                          if (selected) {
                            onUpdate({
                              ...data,
                              selectedMedications: data.selectedMedications.filter(
                                (m) => m.medicationId !== `other-${other.id}`
                              ),
                            });
                          } else {
                            onUpdate({
                              ...data,
                              selectedMedications: [
                                ...data.selectedMedications,
                                {
                                  medicationId: `other-${other.id}`,
                                  medicationName: other.name || '',
                                  quantity: other.quantity,
                                  notes: other.notes,
                                },
                              ],
                            });
                          }
                        }}
                        className="mt-1 size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] border-red-300"
                      />
                      <label htmlFor={`med-other-${other.id}`} className="cursor-pointer flex-1">
                        Other (Please Specify)
                      </label>
                      <button
                        type="button"
                        onClick={() => removeOther(other.id)}
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-md gap-1.5 has-[>svg]:px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={other.name}
                      onChange={(e) => updateOther(other.id, { name: e.target.value })}
                      placeholder="Enter medication name, strength, form, and any additional details..."
                      rows={3}
                      disabled={!selected}
                      style={{ backgroundColor: selected ? 'white' : undefined }}
                      className="resize-none placeholder:text-muted-foreground flex field-sizing-content w-full rounded-md px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]"
                    />
                  </div>
                );
              })}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addOther}
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background hover:text-accent-foreground h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-red-300 text-red-600 hover:bg-red-50"
                >
                  Add Other
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
