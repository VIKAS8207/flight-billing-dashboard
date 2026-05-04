import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Layouts & Pages
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import PublicFlights from './pages/PublicFlights';
import PrivateFlights from './pages/PrivateFlights';
import Payment from './pages/Payment';
import BudgetTracking from './pages/BudgetTracking';
import ChargesMaster from './pages/ChargesMaster';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Make the absolute root redirect to login immediately */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. Public Route: Login stands alone without the dashboard shell */}
        <Route path="/login" element={<Login />} />

        {/* 3. Permanent Dashboard Shell: Pathless route that wraps your sub-modules */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Overview />} />
          <Route path="public-flights" element={<PublicFlights />} />
          <Route path="private-flights" element={<PrivateFlights />} />
          <Route path="payment" element={<Payment />} />
          <Route path="budget" element={<BudgetTracking />} />
          <Route path="charges-master" element={<ChargesMaster />} />
        </Route>

        {/* Fallback: Send any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}