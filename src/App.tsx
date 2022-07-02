import Pictogramas from './pictogramas/components/pictogramas';
import Login from './login/components/login';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login props={undefined} />} />
        <Route path="/pictogramas" element={<Pictogramas/>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/pictogramas-web" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
