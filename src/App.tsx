import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import MachineTest from './pages/MachineTest';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/about">About</Link>
      </nav> */}

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/machine-test" element={<MachineTest />} />
      </Routes>
    </div>
  );
}

export default App;
