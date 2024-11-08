import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import OnCadasterJob from './pages/OnCadasterJob';
import OnBoardingEmpresa from './pages/OnboardingEmpresa';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { UserProvider } from './components/UserContext'; // Importando o UserProvider

const ProtectedRoute = ({ children }) => {
  const [cookies] = useCookies(['user']);
  const authToken = cookies.AuthToken;

  // Se não houver AuthToken, redireciona para a Home
  if (!authToken) {
    return <Navigate to="/" />;
  }

  return children; // Se o AuthToken existir, permite o acesso à rota
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/onBoarding" element={<Onboarding />} />
          <Route path="/onBoardingEmpresa" element={<OnBoardingEmpresa />} />
          <Route path="/OnCadasterJob" element={<ProtectedRoute><OnCadasterJob /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
