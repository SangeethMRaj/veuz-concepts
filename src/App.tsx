import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
