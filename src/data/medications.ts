// Medication categories and their medications
export interface Medication {
  id: string;
  name: string;
  strengths?: string[];
  forms?: string[];
}

export interface MedicationCategory {
  id: string;
  name: string;
  icon: string;
  medications: Medication[];
}

export const medicationCategories: MedicationCategory[] = [
  {
    id: 'acne',
    name: 'Acne',
    icon: 'droplets',
    medications: [
      { id: 'benzoyl-peroxide', name: 'Benzoyl Peroxide', strengths: ['2.5%', '5%', '10%'], forms: ['Gel/Wash', 'Cream'] },
      { id: 'differin-gel', name: 'Differin Gel — Adapalene Gel', strengths: ['0.1%'], forms: ['Gel'] },
      { id: 'salicylic-acid', name: 'Salicylic Acid', strengths: ['0.5%', '1%', '2%'], forms: ['Wash', 'Gel', 'Pad'] },
    ],
  },
  {
    id: 'allergy',
    name: 'Allergy',
    icon: 'circle-alert',
    medications: [
      { id: 'cetirizine', name: 'Cetirizine (Zyrtec)', strengths: ['5mg', '10mg'], forms: ['Tablet', 'Liquid'] },
      { id: 'loratadine', name: 'Loratadine (Claritin)', strengths: ['10mg'], forms: ['Tablet', 'Liquid'] },
      { id: 'diphenhydramine', name: 'Diphenhydramine (Benadryl)', strengths: ['25mg', '50mg'], forms: ['Tablet', 'Liquid', 'Capsule'] },
    ],
  },
  {
    id: 'antifungal-firstaid',
    name: 'Anti-fungal / First Aid',
    icon: 'bandage',
    medications: [
      { id: 'miconazole', name: 'Miconazole', strengths: ['2%'], forms: ['Cream', 'Powder', 'Spray'] },
      { id: 'clotrimazole', name: 'Clotrimazole', strengths: ['1%'], forms: ['Cream', 'Solution'] },
      { id: 'bacitracin', name: 'Bacitracin', strengths: ['500 units/g'], forms: ['Ointment'] },
    ],
  },
  {
    id: 'iron-supplements',
    name: 'Iron Supplements',
    icon: 'droplet',
    medications: [
      { id: 'ferrous-sulfate', name: 'Ferrous Sulfate', strengths: ['325mg'], forms: ['Tablet'] },
      { id: 'ferrous-gluconate', name: 'Ferrous Gluconate', strengths: ['324mg'], forms: ['Tablet'] },
    ],
  },
  {
    id: 'motion-sickness',
    name: 'Motion sickness',
    icon: 'wind',
    medications: [
      { id: 'meclizine', name: 'Meclizine', strengths: ['12.5mg', '25mg'], forms: ['Tablet', 'Chewable'] },
      { id: 'dimenhydrinate', name: 'Dimenhydrinate (Dramamine)', strengths: ['50mg'], forms: ['Tablet', 'Chewable'] },
    ],
  },
  {
    id: 'nasal-spray-eye-drops',
    name: 'Nasal Spray / Eye Drops',
    icon: 'eye',
    medications: [
      { id: 'saline-nasal', name: 'Saline Nasal Spray', strengths: ['0.9%'], forms: ['Spray', 'Drops'] },
      { id: 'artificial-tears', name: 'Artificial Tears', strengths: ['0.5%'], forms: ['Drops'] },
    ],
  },
  {
    id: 'pain-relievers-cough-cold',
    name: 'Pain Relievers/Cough and Cold',
    icon: 'plus',
    medications: [
      { id: 'naproxen', name: 'Aleve — Naproxen Sodium', strengths: ['220mg'], forms: ['Tablet', 'Capsule'] },
      { id: 'ibuprofen', name: 'Ibuprofen (Advil)', strengths: ['200mg', '400mg'], forms: ['Tablet', 'Liquid'] },
      { id: 'acetaminophen', name: 'Acetaminophen (Tylenol)', strengths: ['325mg', '500mg'], forms: ['Tablet', 'Liquid', 'Caplet'] },
      { id: 'dextromethorphan', name: 'Dextromethorphan', strengths: ['15mg/5ml'], forms: ['Liquid', 'Lozenges'] },
    ],
  },
  {
    id: 'stomach-aids',
    name: 'Stomach Aids / Constipation / Gas',
    icon: 'activity',
    medications: [
      { id: 'omeprazole', name: 'Omeprazole (Prilosec)', strengths: ['20mg'], forms: ['Capsule', 'Tablet'] },
      { id: 'simethicone', name: 'Simethicone (Gas-X)', strengths: ['80mg', '125mg'], forms: ['Tablet', 'Liquid'] },
      { id: 'docusate', name: 'Docusate Sodium (Colace)', strengths: ['100mg'], forms: ['Capsule', 'Liquid'] },
    ],
  },
  {
    id: 'vitamin-supplements',
    name: 'Vitamin Supplements',
    icon: 'sparkles',
    medications: [
      { id: 'vitamin-d', name: 'Vitamin D3', strengths: ['400 IU', '1000 IU', '2000 IU'], forms: ['Tablet', 'Softgel', 'Liquid'] },
      { id: 'vitamin-b12', name: 'Vitamin B12', strengths: ['500mcg', '1000mcg'], forms: ['Tablet', 'Sublingual'] },
      { id: 'multivitamin', name: 'Multivitamin', strengths: [], forms: ['Tablet', 'Gummy', 'Liquid'] },
    ],
  },
  {
    id: 'womens-health',
    name: "WOMEN'S HEALTH",
    icon: 'heart',
    medications: [
      { id: 'folic-acid', name: 'Folic Acid', strengths: ['400mcg', '800mcg'], forms: ['Tablet'] },
      { id: 'calcium', name: 'Calcium', strengths: ['500mg', '1000mg'], forms: ['Tablet', 'Chewable'] },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'ellipsis',
    medications: [],
  },
];
