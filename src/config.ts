export const demoPharmacies = [
  { id: 'demo-pharmacy-a', name: 'Demo Pharmacy A' },
  { id: 'demo-pharmacy-b', name: 'Demo Pharmacy B' },
];

export type DemoPharmacy = (typeof demoPharmacies)[number];
