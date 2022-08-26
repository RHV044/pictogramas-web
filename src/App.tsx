import Pictogramas from './pictogramas/components/pictogramas';
import SeleccionarCuenta from './login/components/seleccionarCuenta';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import VincularCuenta from './login/components/vincularCuenta';
import ModificarCuenta from './login/components/modificarCuenta';
import CrearCuenta from './login/components/crearCuenta';
import Categorias from './pictogramas/components/categorias/categorias';
import Configuracion from './configuracion/configuracion';
import Pizarras from './pizarras/pizarras';
import Estadisticas from './estadisticas/estadisticas';
import SeleccionDeNivel from './actividades/seleccionDeNivel';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import Actividad from './actividades/actividad';

function App() {

  return (
    <div>
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>

            <Route path="/cuenta/seleccionar" element={<SeleccionarCuenta props={undefined} />} />
            <Route path="/cuenta/modificar" element={<ModificarCuenta props={undefined} />} />
            <Route path="/cuenta/vincular" element={<VincularCuenta props={undefined} />} />
            <Route path="/cuenta/crear" element={<CrearCuenta props={undefined} />} />
            <Route path="/pictogramas" element={<Pictogramas/>} />
            <Route path="/categorias" element={<Categorias/>} />
            <Route path="/configuracion" element={<Configuracion/>} />
            <Route path="/pizarras" element={<Pizarras/>} />
            <Route path="/estadisticas" element={<Estadisticas/>} />
            <Route path="/actividades" element={<SeleccionDeNivel/>} />
            <Route path="/actividad/:nivel" element={<Actividad/>} />

            <Route path="/" element={<Navigate to="/cuenta/seleccionar" />} />
            <Route path="/pictogramas-web" element={<Navigate to="/cuenta/seleccionar" />} />
            <Route path="/cambiarcuenta" element={<Navigate to="/cuenta/seleccionar" />} />

        </Routes>
      </BrowserRouter>
    </DndProvider>
    </div>
  );
}

export default App;
