import Pictogramas from './pictogramas/components/pictogramas';
import SeleccionarCuenta from './login/components/seleccionarCuenta';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import VincularCuenta from './login/components/vincularCuenta';
import ModificarCuenta from './login/components/modificarCuenta';
import CrearCuenta from './login/components/crearCuenta';
import CategoriasRaices from './pictogramas/components/categorias/categoriasRaices';
import Configuracion from './configuracion/configuracion';
import Pizarras from './pizarras/pizarras';
import Estadisticas from './estadisticas/estadisticas';
import SeleccionDeNivel from './actividades/seleccionDeNivel';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import Actividad from './actividades/actividad';
import { useState, useEffect } from 'react';
import { UpdateService } from './services/update-service';
import { TouchBackend } from "react-dnd-touch-backend"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {

  const isMobile = window.innerWidth < 600

  useEffect(() => {
    let updateService = new UpdateService()
    console.log("URL PICTOGRAMAS: ", process.env.REACT_APP_URL_PICTOGRAMAS)
    console.log("es mobile? : ", isMobile)
  },[])

  useEffect(() => {
    console.log("es mobile? : ", isMobile)
  },[isMobile])

  return (
    <div>
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={{ enableMouseEvents: true }}>
    {/* <DndProvider backend={ TouchBackend } options={{ enableMouseEvents: true }}> */}
      <BrowserRouter>
        <Routes>
          <Route path="/cuenta/seleccionar" element={<SeleccionarCuenta props={undefined} />} />
          <Route path="/cuenta/modificar" element={<ModificarCuenta props={undefined} />} />
          <Route path="/cuenta/vincular" element={<VincularCuenta props={undefined} />} />
          <Route path="/cuenta/crear" element={<CrearCuenta props={undefined} />} />
          <Route path="/pictogramas" element={<Pictogramas/>} />
          <Route path="/categorias" element={<CategoriasRaices/>} />
          <Route path="/configuracion" element={<Configuracion/>} />
          <Route path="/pizarras" element={<Pizarras/>} />
          <Route path="/estadisticas" element={<Estadisticas/>} />
          <Route path="/actividades" element={<SeleccionDeNivel/>} />
          <Route path="/actividad/:nivel" element={<Actividad/>} />
          <Route path="/" element={<Navigate to="/cuenta/seleccionar" />} />
          <Route path="/pictogramas-web" element={<Navigate to="/cuenta/seleccionar" />} />
          <Route path="/cambiarcuenta" element={<Navigate to="/cuenta/seleccionar" />} />
            {/* Optional index route if no nested routes match */}
          <Route path="*" element={<Navigate to="/pictogramas" />} />
        </Routes>
      </BrowserRouter>
    </DndProvider>
    </div>
  );
}

export default App;
