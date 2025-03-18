import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthCallback from '@/pages/AuthCallback';
import Home from '@/pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
}

export default App;