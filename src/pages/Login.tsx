import { Button } from '../components/Button';
import { demoPharmacies, type DemoPharmacy } from '../config';

export function Login({ onSelect }: { onSelect: (pharmacy: DemoPharmacy) => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">OTC Request Form Demo</h1>
        <p className="mb-6 text-slate-600">
          Choose a fictional pharmacy to try the form with made-up patient and provider details.
        </p>
        <div className="flex flex-col gap-3 items-center">
          {demoPharmacies.map((pharmacy) => (
            <Button key={pharmacy.id} onClick={() => onSelect(pharmacy)} variant="primary">
              {pharmacy.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
