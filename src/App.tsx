import Pictogramas from './pictogramas/components/pictogramas';
import SeleccionarCuenta from './login/components/seleccionarCuenta';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AgregarCuenta from './login/components/agregarCuenta';
import ModificarCuenta from './login/components/modificarCuenta';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cuenta/seleccionar" element={<SeleccionarCuenta props={undefined} />} />
        <Route path="/cuenta/modificar" element={<ModificarCuenta props={undefined} />} />
        <Route path="/cuenta/agregar" element={<AgregarCuenta props={undefined} />} />
        <Route path="/pictogramas" element={<Pictogramas/>} />
        
        <Route path="/" element={<Navigate to="/cuenta/seleccionar" />} />
        <Route path="/pictogramas-web" element={<Navigate to="/cuenta/seleccionar" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
