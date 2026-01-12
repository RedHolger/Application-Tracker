import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import Navbar from './components/Navbar';

function App() {
  return (
    <ApplicationProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<ApplicationForm />} />
              <Route path="/edit/:id" element={<ApplicationForm />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApplicationProvider>
  );
}

export default App;
