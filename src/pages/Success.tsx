import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export function Success() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <img src="/otc.png" alt="OTC Form Icon" className="w-[150px] h-auto" />
        </div>
        <h1 className="text-slate-800 font-bold uppercase mb-4" style={{ fontSize: 'calc(1em + 6.66667px)' }}>
          The OTC Request Form Has Been Emailed!
        </h1>
        <p className="text-slate-600 mb-8">
          Please print the form and either hand it to the patient or fax it to their doctor for prescription authorization.
        </p>
        <Button
          onClick={handleGoBack}
          variant="primary"
          size="lg"
          className="focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
