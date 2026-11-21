import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { demoPharmacies, type DemoPharmacy } from './config';
import { Login } from './pages/Login';
import { Form } from './pages/Form';
import { Success } from './pages/Success';

const SESSION_KEY = 'otc-demo-pharmacy';

function App() {
  const [pharmacy, setPharmacy] = useState<DemoPharmacy | null>(() => {
    const pharmacyId = sessionStorage.getItem(SESSION_KEY);
    return demoPharmacies.find((entry) => entry.id === pharmacyId) ?? null;
  });

  const startDemo = (pharmacy: DemoPharmacy) => {
    sessionStorage.setItem(SESSION_KEY, pharmacy.id);
    setPharmacy(pharmacy);
  };

  const exitDemo = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setPharmacy(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={pharmacy ? <Navigate to="/form" replace /> : <Login onSelect={startDemo} />}
        />
        <Route
          path="/form"
          element={pharmacy ? <Form pharmacy={pharmacy} onExit={exitDemo} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/success"
          element={pharmacy ? <Success /> : <Navigate to="/login" replace />}
        />
        <Route path="/reset-password" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
