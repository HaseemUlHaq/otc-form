export interface SelectedMedication {
  medicationId: string;
  medicationName: string;
  strength?: string;
  form?: string;
  other?: string;
  quantity?: string;
  notes?: string;
}

export interface OtherMedication {
  id: string;
  name: string;
  quantity?: string;
  notes?: string;
}

export interface CategoryData {
  selectedMedications: SelectedMedication[];
  otherMedications: OtherMedication[];
}

export interface OTCFormData {
  patientFirstName: string;
  patientLastName: string;
  dateOfBirth: string;
  primaryCarePhysician: string;
  categories: Record<string, CategoryData>;
  pdfType: 'A' | 'B' | '';
}

export const initialFormData: OTCFormData = {
  patientFirstName: '',
  patientLastName: '',
  dateOfBirth: '',
  primaryCarePhysician: '',
  categories: {},
  pdfType: '',
};
