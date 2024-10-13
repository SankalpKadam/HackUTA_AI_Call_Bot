import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@src/app.css'

// Import your components for the routes
import HomePage from './pages/HomePage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import BusinessSetup from './pages/BusinessSetup.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx'
import ViewOrders from './pages/ViewOrders.tsx'

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/businesssetup" element={<BusinessSetup />} />
          <Route path="/vieworders" element={<ViewOrders />} />
        </Routes>
    </Router>
  );
}

export default App;
