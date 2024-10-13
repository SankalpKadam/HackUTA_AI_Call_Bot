import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/index.css'

// Import your components for the routes
import HomePage from './pages/HomePage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import BusinessSetup from './pages/BusinessSetup.tsx';
import LoginPage from './pages/LoginPage.tsx';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buinesssetup" element={<BusinessSetup />} />
        </Routes>
    </Router>
  );
}

export default App;
