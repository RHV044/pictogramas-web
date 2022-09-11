import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Autocomplete,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  TextField,
} from '@mui/material';
import { LoadPictogramsFromArasaac } from '../services/arasaac-service';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IPictogram } from '../models/pictogram';
import Pictogram from './pictogram';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoriasRaices from './categorias/categoriasRaices';
import Seleccion from './seleccion';
import { UpdateService } from '../../services/update-service';
import ResponsiveAppBar from '../../commons/appBar';
import FormDialog from './crearPictograma';
import { ICategoria } from '../models/categoria';
import CategoriaSeleccionada from './categorias/categoriaSeleccionada';
import PictogramasPorCategoria from './categorias/pictogramasPorCategoria';
import { ObtenerCategorias, ObtenerPictogramas } from '../services/pictogramas-services';
import Categoria from './categorias/categoria';
const db = new IndexedDbService();

export default function Pictogramas(props: any) {
  let navigate = useNavigate();
  let location = useLocation();
  const [imageUrl, setImageUrl] = useState('');
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [pictosIds, setPictosIds] = useState([] as string[]);
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  // Usando otra lista al menos renderiza uno
  const [pictogramasSeleccionados, setPictogramasSeleccionados] = useState(
    [] as IPictogram[] | null
  );
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    null as ICategoria | null
  );
  const [pictogramasFiltrados, setPictogramasFiltrados] = useState(
    [] as IPictogram[]
  );
  const [db, setDb] = useState(IndexedDbService.create());
  const [categorias, setCategorias] = useState([] as ICategoria[]) 

  const UpdatePictogramas = (pics: IPictogram[]) => {
    let nuevosPics = [...pics]
    setPictogramas(nuevosPics);
    // Esto se hace pero en la 2da vez el componente seleccion no se renderiza nuevamente
    setPictogramasSeleccionados(null);
    setPictogramasSeleccionados(nuevosPics);
  };

  useEffect(() => {
    ObtenerPictogramas().then((pictogramas) => {
      setPictogramas(pictogramas);
    });
    ObtenerCategorias(setCategorias);
  }, []);

  const filtrarPictogramas = async (value: string) => {
    if (value === '' || value === null)
    {
      setPictogramasFiltrados([])
    }
    else{
      let pictsFiltrados = pictogramas
        .filter((p) => (p.keywords.some((k) => k.keyword.includes(value)) === true || p.categorias?.some((c) => c.nombre.includes(value)) === true))
        .slice(0, 5)
      await Promise.all(pictsFiltrados.map( async (p) => {
        let imagen = await db.then( x => x.getValue('imagenes',p.id))
        p.imagen = imagen.imagen
      }))      
      setPictogramasFiltrados(pictsFiltrados);
    }
  };

  const ObtenerCategoriaPadre = (categoria: ICategoria) => {
    if (categoria.categoriaPadre === null || categoria.categoriaPadre < 1 || categoria.categoriaPadre === undefined)
    {
      // Es categoria raiz
      return (<>
      {          
        <CategoriaSeleccionada
          categoriaSeleccionada={categoria}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
        />
      }
      </>)
    }
    else
    {
      let categoriaPadre = categorias.find(c => c.id === categoria.categoriaPadre)
      return(
        <>{ categoriaPadre && ObtenerCategoriaPadre(categoriaPadre)}
        /
        {
          <CategoriaSeleccionada
            categoriaSeleccionada={categoria}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
        }
        </>
      )
    }
  }

  const ListaCategorias = (categoria: ICategoria) => {
    return (<>{ObtenerCategoriaPadre(categoria)}</>)
  }

  const OpcionesDeCategoria = (categoria: ICategoria) => {
    if (categoria.esCategoriaFinal === true)
    {
      // Es categoria final, debo mostrar pictogramas
      return (<>
          <PictogramasPorCategoria
            categoria={categoria.id}
            setPictogramas={UpdatePictogramas}
            pictogramas={pictogramasSeleccionados}
          ></PictogramasPorCategoria>
      </>)
    }
    else
    {
      // Es categoria padre, debo mostrar categorias
      let categoriasHijas = categorias.filter(c => c.categoriaPadre === categoria.id)
      return(
        <Container>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 10, md: 12 }}>
          { categoriasHijas.map((categoria) => {
            return (
                <Grid
                  key={categoria.id + '-' + categoria.nombre}
                  item xs={12} sm={4} md={2}
                >
                  <Container key={categoria.id + '-' + categoria.nombre}>
                    <Categoria 
                      setCategoriaSeleccionada={setCategoriaSeleccionada} 
                      categoria={categoria}
                      categoriaSeleccionada={categoriaSeleccionada}
                      categorias={categorias}
                    />
                  </Container>
                </Grid>
              );
          })}
          </Grid>
        </Container>
      )
    }
  }

  return (
    <div>
      <ResponsiveAppBar />
      <br />
      <Seleccion
        pictogramas={pictogramasSeleccionados}
        setPictogramas={UpdatePictogramas}
      />
      <hr />
      {/* <Button
        variant="contained"
        onClick={() =>
          LoadPictogramsFromArasaac(setPictosIds, setDownloadPercentage)
        }
      >
        Descargar todo Arasaac
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          let updateService = new UpdateService();
        }}
      >
        Descargar Pictogramas Nuestros
      </Button> */}

      <CircularProgress variant="determinate" value={downloadPercentage} />
      <br></br>
      {/*  Dejo comentado la busqueda de pictogramas original de Arasaac
      <TextField
        id="input-tag-filter"
        label="Filtrar pictogramas por etiqueta o palabras clave"
        variant="standard"
        onChange={(event) => {
          if (event?.target?.value)
            inputTagFilterChanged(event.target.value, setPictosIds);
        }}
      />
      <br></br>
      <Autocomplete
        id="select-pictogramid"
        options={pictosIds}
        getOptionLabel={(option) => option}
        sx={{ width: 300 }}
        onChange={(event, value) => {
          if (value) selectPictogramIdChanged(value, setImageUrl);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Elija el pictograma que desea visualizar"
          />
        )}
      />
      <Pictogram pictoImageUrl={imageUrl} /> 
      */}
      <br></br>
      <TextField
        id="input-tag-filter"
        label="Filtrar pictogramas por palabra clave o categoria"
        variant="standard"
        onChange={(event) => {
          filtrarPictogramas(event.target.value);
        }}
      />
      <Container>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 10, md: 12 }}
        >
          {pictogramasFiltrados.map((pictograma) => {
            return (
              //Como estan dentro de la categoria, se visualizan abajo, habria que extraerlo a otro lugar
              <Grid key={pictograma.id} item xs={12} sm={4} md={2}>
                <Container key={pictograma.id}>
                  <Card
                    sx={{ maxWidth: 245, minWidth: 150 }}
                    style={{ marginTop: '10px' }}
                    onClick={() => {}}
                  >
                    <CardActionArea
                      onClick={() => {
                        if(pictogramasSeleccionados){
                          let pictogramasSel = [...pictogramasSeleccionados];
                          if (pictogramasSel !== null) {
                            pictogramasSel.push(pictograma);
                            setPictogramasSeleccionados(pictogramasSel);
                          }
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        src={`data:image/png;base64, ${pictograma.imagen}`}
                        alt={pictograma.keywords[0].keyword}
                      ></CardMedia>
                      <CardHeader
                        title={pictograma.keywords[0].keyword}
                      ></CardHeader>
                      <CardContent></CardContent>
                    </CardActionArea>
                  </Card>
                </Container>
              </Grid>
            );
          })}
        </Grid>
      </Container>
      <br></br>
      <hr />
      <FormDialog />
      {/* TODO: Debe poder concatenar categorias hasta llegar a categoria final */}
      {/* 
        TODO: categoriaSeleccionada no necesariamente debe pasar a ser un array de categorias para manejar las hijas
          se puede preguntar si categoria padre es !== null y si esCategoriaFinal es true para saber si se finaliza
          si categoriaPadre === null, es raiz por lo que seria la primera
      */}
      {/* TODO: Se debe renderizar las categorias hijas o los pictogramas si es categoria final */}
      { categoriaSeleccionada && ListaCategorias(categoriaSeleccionada) }
      { categoriaSeleccionada && OpcionesDeCategoria(categoriaSeleccionada) }
      {/* { categoriaSeleccionada && (
        <div>
          <CategoriaSeleccionada
            categoriaSeleccionada={categoriaSeleccionada}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
          <PictogramasPorCategoria
            categoria={categoriaSeleccionada.id}
            setPictogramas={UpdatePictogramas}
            pictogramas={pictogramasSeleccionados}
          ></PictogramasPorCategoria>
        </div>
      )} */}

      {/* Si paso setPictogramas tampoco me actualiza */}
      {/* <Categorias setPictogramas={setPictogramas} pictogramas={pictogramas}/> */}
      <br />
      {/* TODO: Si se selecciona, el listado de categorias seleccionadas se debe reiniciar */}
      Aca empiezan las categorias raices
      <br />
      <CategoriasRaices
        setPictogramas={UpdatePictogramas}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />
    </div>
  );
}
async function selectPictogramIdChanged(value: string, setImageUrl: any) {
  let arr = value.split('#');
  let picto: IPictogram = await db.getPictogram(Number(arr[arr.length - 1]));
  if (picto?.blob) {
    let url = URL.createObjectURL(picto.blob);
    setImageUrl(url);
  } else setImageUrl(undefined);
}
async function inputTagFilterChanged(
  value: string,
  setPictosIds: React.Dispatch<React.SetStateAction<string[]>>
) {
  let searchResult = await db.searchPictogramsByTag(value);
  setPictosIds(searchResult.map((x) => `${x.name}#${x.id}`).sort());
}
