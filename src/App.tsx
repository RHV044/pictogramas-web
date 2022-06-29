import Pictogramas from './pictogramas/components/pictogramas';
import Login from './login/login';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/pictogramas" element={<Pictogramas/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
