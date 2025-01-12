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
import { HTML5Backend } from 'react-dnd-html5-backend';
import Actividad from './actividades/actividad';
import { useEffect, useState } from 'react';
import { UpdateService } from './services/update-service';
import { TouchBackend } from 'react-dnd-touch-backend';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useDispatch } from 'react-redux';
import { changeValue } from './redux/slices/porcentajeSlice';

function App() {
  const isMobile = window.innerWidth < 600;
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    console.log('URL PICTOGRAMAS: ', process.env.REACT_APP_URL_PICTOGRAMAS);
    console.log('es mobile? : ', isMobile);
    // let porcentajeActual = updateService.porcentajeDeDescarga();
    // let timer = setInterval(function () {
    //   porcentajeActual = updateService.porcentajeDeDescarga();
    //   dispatch(changeValue(porcentajeActual));
    //   console.log('Porcentaje de descarga de update service: ', porcentajeActual);
    //   if (porcentajeActual >= 100) {
    //     clearInterval(timer);
    //     return;
    //   }
    // }, 5000);
    window.addEventListener('BotonSincronizar', () => {
      if (!updating){
        setUpdating(true)
        console.log('SE UTILIZA BOTON SINCRONIZAR');
        let updateService = new UpdateService();
        updateService.initialize();
        updateService.sincronizar();
        let nuevoPorcentaje = 5
        let porcentajeActual = updateService.porcentajeDeDescarga();
        if (porcentajeActual > nuevoPorcentaje){
          nuevoPorcentaje = porcentajeActual
        }
        dispatch(changeValue(nuevoPorcentaje));

        let timer = setInterval(function () {
          porcentajeActual = updateService.porcentajeDeDescarga();
          if (porcentajeActual > nuevoPorcentaje){
            nuevoPorcentaje = porcentajeActual
          }
          dispatch(changeValue(nuevoPorcentaje));
          console.log('Porcentaje de descarga de update service: ', porcentajeActual);
          if (porcentajeActual >= 100) {
            clearInterval(timer);
            let timer2 = setInterval(function () {
              // updateService.reiniciarState();
              setUpdating(false)
            } , 5000);         
            return;
          }

          setTimeout(function(){
            console.log("CANCELAMOS SYNC")
            dispatch(changeValue(100));
            clearInterval(timer);
            setUpdating(false)
          },60000);
        }, 5000);
      }
    });
  }, []);

  function verificarDescarga() {}

  useEffect(() => {
    console.log('es mobile? : ', isMobile);
  }, [isMobile]);

  return (
    <div>
      <DndProvider
        backend={isMobile ? TouchBackend : HTML5Backend}
        options={{ enableMouseEvents: true }}
      >
        {/* <DndProvider backend={ TouchBackend } options={{ enableMouseEvents: true }}> */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/cuenta/seleccionar"
              element={<SeleccionarCuenta props={undefined} />}
            />
            <Route
              path="/cuenta/modificar"
              element={<ModificarCuenta props={undefined} />}
            />
            <Route
              path="/cuenta/vincular"
              element={<VincularCuenta props={undefined} />}
            />
            <Route
              path="/cuenta/crear"
              element={<CrearCuenta props={undefined} />}
            />
            <Route path="/pictogramas" element={<Pictogramas />} />
            <Route path="/categorias" element={<CategoriasRaices />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/pizarras" element={<Pizarras />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/actividades" element={<SeleccionDeNivel />} />
            <Route path="/actividad/:nivel" element={<Actividad />} />
            <Route path="/" element={<Navigate to="/cuenta/seleccionar" />} />
            <Route
              path="/pictogramas-web"
              element={<Navigate to="/cuenta/seleccionar" />}
            />
            <Route
              path="/cambiarcuenta"
              element={<Navigate to="/cuenta/seleccionar" />}
            />
            {/* Optional index route if no nested routes match */}
            <Route path="*" element={<Navigate to="/pictogramas" />} />
          </Routes>
        </BrowserRouter>
      </DndProvider>
    </div>
  );
}

export default App;
