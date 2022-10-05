import { Alert, Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ResponsiveAppBar from "../commons/appBar";
import { ICategoria } from "../pictogramas/models/categoria";
import { IPictogram } from "../pictogramas/models/pictogram";
import { ObtenerCategoriasIndexDB, ObtenerPictogramas } from "../pictogramas/services/pictogramas-services";
import { IndexedDbService } from "../services/indexeddb-service";

export default function Actividad(){
  let navigate = useNavigate();
  let location = useLocation();
  const params = useParams();
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [categorias, setCategorias] = useState([] as ICategoria[])

  const [categoria1, setCategoria1] = useState(null as ICategoria | null)
  const [categoria2, setCategoria2] = useState(null as ICategoria | null)
  const [categoria3, setCategoria3] = useState(null as ICategoria | null)
  const [categoria4, setCategoria4] = useState(null as ICategoria | null)
  const [pictograma, setPictograma] = useState(null as IPictogram | null)
  const [categoriaCorrecta, setCategoriaCorrecta] = useState({} as ICategoria)
  const [resultadoCorrecto, setResultadoCorrecto] = useState(false)
  const [resultadoIncorrecto, setResultadoIncorrecto] = useState(false)

  useEffect(() => {
    inicializar()
  }, [])

  const inicializar = () => {
    ObtenerCategoriasIndexDB().then((cats) => {
      setCategorias(cats.sort(() => (Math.random() > 0.5 ? 1 : -1)))
      ObtenerPictogramas().then((pics : IPictogram[]) => {
        setPictogramas(pics);      
      });
    })
  }

  useEffect(() => {
    setCategoria1(categorias[0])
    setCategoriaCorrecta(categorias[0])
    setCategoria2(categorias[1])
    setCategoria3(categorias[2])
    setCategoria4(categorias[3])
  }, [categorias]) 

  useEffect(() => {
    let pic = pictogramas.find((p : IPictogram) => 
      p.categorias?.sort(() => (Math.random() > 0.5 ? 1 : -1)).some(c => c.id === categoria1?.id 
        && c.id !== categoria2?.id && c.id !== categoria3?.id && c.id !== categoria4?.id))   
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

  const cargarNuevoJuego = () => {
    inicializar()   
    // navigate('/actividad/' + params.nivel + location.search);
  }

  const verificar = (idCategoria : number) => {
    if (idCategoria === categoriaCorrecta.id){
      setResultadoCorrecto(true)
      setTimeout(function () {
        cargarNuevoJuego()
        setResultadoCorrecto(false)
      }, 1000);
    }
    else{
      setResultadoIncorrecto(true)
      setTimeout(function () {
        setResultadoIncorrecto(false)
      }, 3000);
    }
  }

  const renderCategoria = (categoria: ICategoria) => {
    return(<div>
      <Card
        sx={{ maxWidth: 145, minWidth:25 }}
        style={{ marginTop: '10px' }}
        onClick={() => {}}
      >
        <CardActionArea
          onClick={() => {
            verificar(categoria.id)
          }}
        >
          <CardMedia
            component="img"
            height="140"
            src={`data:image/png;base64,${categoria.imagen}`}
            alt={categoria.nombre}
          ></CardMedia>
          <CardHeader
            title={categoria.nombre}
          ></CardHeader>
          <CardContent></CardContent>
        </CardActionArea>
      </Card>
    </div>)
  }

  return(
    <div>
      {categoria1 && categoria2 && pictograma &&
        <div>
          <ResponsiveAppBar />
          Juego de Categorizar los Pictogramas - Nivel {params.nivel}
          {resultadoCorrecto ? <Alert severity="success">Correcto!</Alert> : <></> }
          {resultadoIncorrecto ? <Alert severity="error">Incorrecto</Alert> : <></> }
          <br/>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>   
            <Grid key={categoria1.id} item xs={2} sm={4} md={3}>
              {renderCategoria(categoria1)}
            </Grid>
            <Grid key={categoria2.id} item xs={2} sm={4} md={3}>
              {renderCategoria(categoria2)}
            </Grid>
            { params.nivel !== undefined && parseInt(params.nivel) > 1 && categoria3 !== null &&
              <Grid key={categoria3.id} item xs={2} sm={4} md={3}>
                {renderCategoria(categoria3)}
              </Grid>
            }
            { params.nivel !== undefined && parseInt(params.nivel) > 2 && categoria4 !== null &&
              <Grid key={categoria4.id} item xs={2} sm={4} md={3}>
                {renderCategoria(categoria4)}
              </Grid>
            }
          </Grid>
          <div>
            <Card
              sx={{ maxWidth: 245, minWidth:150 }}
              style={{ marginTop: '10px' }}
              onClick={() => {}}
            >
              <CardActionArea
                onClick={() => {
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  src={pictograma.imagen.includes('data:image') ? pictograma.imagen : `data:image/png;base64,${pictograma.imagen}`}
                  alt={pictograma.keywords[0].keyword}
                ></CardMedia>
                <CardHeader
                  title={pictograma.keywords[0].keyword}
                ></CardHeader>
                <CardContent></CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      }
    </div>
  )
}