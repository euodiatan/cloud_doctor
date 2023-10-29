import * as React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Test from './Pages/Dashboard'
import LoginPage from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import PatientDetail from './Pages/PatientDetail'


function App() {
  return (
    
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/patient/:name" element={<PatientDetail />}  />
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </div>

  );
}

export default App;