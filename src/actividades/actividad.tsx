import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ResponsiveAppBar from "../commons/appBar";
import { ICategoria } from "../pictogramas/models/categoria";
import { IPictogram } from "../pictogramas/models/pictogram";
import { ObtenerCategoriasIndexDB, ObtenerPictogramas } from "../pictogramas/services/pictogramas-services";
import { IndexedDbService } from "../services/indexeddb-service";
import { CategoriaDrop } from "./categoriaDrop";
import { PictogramaDrag } from "./pictogramaDrag";
import { Reglas } from "./reglas";

export default function Actividad(){
  const location = useLocation();
  const params = useParams();
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [categorias, setCategorias] = useState([] as ICategoria[])
  const reglas = useMemo(() => new Reglas(), []);

  const [categoria1, setCategoria1] = useState(null as ICategoria | null)
  const [categoria2, setCategoria2] = useState(null as ICategoria | null)
  const [categoria3, setCategoria3] = useState(null as ICategoria | null)
  const [categoria4, setCategoria4] = useState(null as ICategoria | null)
  const [pictograma, setPictograma] = useState(null as IPictogram | null)

  useEffect(() => {
    ObtenerCategoriasIndexDB().then((cats) => {
      setCategorias(cats.sort(() => (Math.random() > 0.5 ? 1 : -1)))
      ObtenerPictogramas().then((pics : IPictogram[]) => {
        setPictogramas(pics);      
      });
    })
  }, [])

  useEffect(() => {
    setCategoria1(categorias[0])
    setCategoria2(categorias[1])
    setCategoria3(categorias[2])
    setCategoria4(categorias[3])
  }, [categorias]) 

  useEffect(() => {
    let pic = pictogramas.find((p : IPictogram) => 
      p.categorias?.sort(() => (Math.random() > 0.5 ? 1 : -1)).some(c => c.id === categoria1?.id && c.id !== categoria2?.id))   
    pic === undefined ? setPictograma(null) : setPictograma(pic)
    if (pic !== undefined && pic.imagen === ''){
      //Obtener Imagen de pictograma
      IndexedDbService.create().then(async (db) => {
        if (pic !== undefined){
          pic.imagen = (await db.getValue('imagenes', pic?.id)).imagen
        } 

        // Reordenar al azar las categorias:
        var categoriasFinales = [categoria1, categoria2, categoria3, categoria4]
        var categoriasReorganizadas = categoriasFinales.sort(() => (Math.random() > 0.5 ? 1 : -1))
        setCategoria1(categoriasReorganizadas[0])
        setCategoria2(categoriasReorganizadas[1])
        setCategoria3(categoriasReorganizadas[2])
        setCategoria4(categoriasReorganizadas[3])
      })      
    }
    else {
        // Reordenar al azar las categorias:
        var categoriasFinales = [categoria1, categoria2, categoria3, categoria4]
        var categoriasReorganizadas = categoriasFinales.sort(() => (Math.random() > 0.5 ? 1 : -1))
        setCategoria1(categoriasReorganizadas[0])
        setCategoria2(categoriasReorganizadas[1])
        setCategoria3(categoriasReorganizadas[2])
        setCategoria4(categoriasReorganizadas[3])
    }

  }, [pictogramas])

  return(
    <div>
      {categoria1 && categoria2 && pictograma &&
        <div>
          <ResponsiveAppBar />
          Juego de Categorizar los Pictogramas - Nivel {params.nivel}
          <br/>
          {categoria1.nombre}:
          <CategoriaDrop pictograma={pictograma} categoria={categoria1} onDrop={() => {}} reglas={reglas}/>
          {categoria2.nombre}:
          <CategoriaDrop pictograma={pictograma} categoria={categoria2} onDrop={() => {}} reglas={reglas}/>
          <br />
          { params.nivel !== undefined && parseInt(params.nivel) > 1 && categoria3 !== null &&
            <div>
              {categoria3.nombre}:
              <CategoriaDrop pictograma={pictograma} categoria={categoria2} onDrop={() => {}} reglas={reglas}/>
              <br />
            </div>
          }
          { params.nivel !== undefined && parseInt(params.nivel) > 2 && categoria4 !== null &&
            <div>
              {categoria4.nombre}:
              <CategoriaDrop pictograma={pictograma} categoria={categoria2} onDrop={() => {}} reglas={reglas}/>
              <br />
            </div>
          }
          <PictogramaDrag pictograma={pictograma} onDrop={() => {}} reglas={reglas}/>
        </div>
      }
    </div>
  )
}