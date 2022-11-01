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
import { learn, predict } from '../services/predictivo-service';
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
import {
  ObtenerCategorias,
  ObtenerPictogramas,
} from '../services/pictogramas-services';
import Categoria from './categorias/categoria';
import {
  getUsuarioLogueado,
  setUsuarioLogueado,
  setUsuarioLogueadoVariable,
  usuarioLogueado,
} from '../../services/usuarios-services';
import Recientes from './sugerencias/recientes';
import Sugeridos from './sugerencias/sugeridos';
import { CurrencyBitcoin } from '@mui/icons-material';
import { ICategoriaPorUsuario } from '../models/categoriaPorUsuario';
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
  const [pictogramasPredecidos, setPictogramasPredecidos] = useState(
    [] as IPictogram[]
  );
  const [db, setDb] = useState(IndexedDbService.create());
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriasPorUsuario, setCategoriasPorUsuario] = useState(
    [] as ICategoriaPorUsuario[]
  );

  const LearnAndPredict = async (pics: IPictogram[]) => {
    if (pics && pics.length >= (pictogramasSeleccionados?.length ?? 0)) {
      //Entrena al algoritmo Naive Bayes.
      learn(pics);

      let pictoAgregado = pics[pics.length - 1];
      let pictoPrevio = pics[pics.length - 2];
      let pictosAnteriores = pics.slice(0, pics.length - 1);
      //TODO: Si es el primero, es un nuevo registro
      // pero si es uno que continua, debo pisar el registro (de esta manera guardo un unico registro que contiene toda la secuencia)

      if (pictosAnteriores.length > 0) {
        // Esta seleccion ya fue iniciada previamente, debo actualizar un registro existente
        IndexedDbService.create().then((indexeddb) => {
          indexeddb
            .getAllValues('historicoUsoPictogramas')
            .then(async (registros) => {
              // Agarro Automaticamente el ultimo ya que este es el que debo pisar
              let historicoReverso = registros.slice().reverse();
              let id = historicoReverso[0].id;
              if (id !== 0) {
                // Utilizo automaticamente el ultimo ID generado
                indexeddb.putOrPatchValue('historicoUsoPictogramas', {
                  id: id,
                  fecha: new Date().toISOString(),
                  usuario: usuarioLogueado?.id,
                  pictograma: pictoAgregado,
                  previo: pictoPrevio,
                  todosLosAnteriores: pictosAnteriores,
                });
              } else {
                // No deberia nunca entrar aca
                indexeddb.putOrPatchValue('historicoUsoPictogramas', {
                  id: usuarioLogueado?.id + '_' + Date.now().toString(),
                  usuario: usuarioLogueado?.id,
                  fecha: new Date().toISOString(),
                  pictograma: pictoAgregado,
                  previo: pictoPrevio,
                  todosLosAnteriores: pictosAnteriores,
                });
              }
            });
        });
      } else {
        // Esta seleccion es nueva, debe obligatoriamente crear un nuevo registro
        (await db).putBulkValue('historicoUsoPictogramas', [
          {
            id: usuarioLogueado?.id + '_' + Date.now().toString(),
            usuario: usuarioLogueado?.id,
            fecha: new Date().toISOString(),
            pictograma: pictoAgregado,
            previo: pictoPrevio,
            todosLosAnteriores: pictosAnteriores,
          },
        ]);
      }
    }
    let prediccionProximosPictos = await predict(pics);
    setPictogramasPredecidos(prediccionProximosPictos);
    console.log(
      `Proximos Pictogramas sugerido: ${
        prediccionProximosPictos && prediccionProximosPictos.length > 0
          ? prediccionProximosPictos
              .map((x) => x.keywords[0].keyword)
              .reduce((prev, curr) => prev + ', ' + curr)
          : 'no prediction'
      }`
    );
  };

  const UpdatePictogramas = async (pics: IPictogram[]) => {
    let nuevosPics = [...pics];

    LearnAndPredict(pics);
    // Esto se hace pero en la 2da vez el componente seleccion no se renderiza nuevamente
    setPictogramasSeleccionados(null);

    setPictogramasSeleccionados(nuevosPics);
  };

  useEffect(() => {
    dispatchEvent(new CustomEvent('sincronizar'));

    getUsuarioLogueado().then((usuario) => {
      if (usuario === null || usuario === undefined) {
        // Redirijo a seleccionar cuenta
        navigate('/cuenta/seleccionar' + location.search);
      } else {
        setUsuarioLogueadoVariable(usuario);

        if ((usuario?.nivel !== undefined ? usuario?.nivel : 0) === 3) {
          IndexedDbService.create().then(async (indexeddb) => {
            let categoriasPorUsuario = await indexeddb.getAllValues(
              'categoriasPorUsuario'
            );
            setCategoriasPorUsuario(categoriasPorUsuario);
          });
        }
      }
    });

    ObtenerPictogramas().then((pictogramas) => {
      setPictogramas(pictogramas);
    });

    ObtenerCategorias(setCategorias);
  }, []);

  const filtrarPictogramas = async (value: string) => {
    if (value === '' || value === null) {
      setPictogramasFiltrados([]);
    } else {
      let pictsFiltrados = pictogramas
        .filter(
          (p) =>
            p.keywords.some((k) => k.keyword.includes(value)) === true ||
            p.categorias?.some((c) => c.nombre.includes(value)) === true
        )
        .slice(0, 5);
      await Promise.all(
        pictsFiltrados.map(async (p) => {
          let imagen = await db.then((x) => x.getValue('imagenes', p.id));
          p.imagen = imagen.imagen;
        })
      );
      setPictogramasFiltrados(pictsFiltrados);
    }
  };

  const ObtenerCategoriaPadre = (categoria: ICategoria) => {
    if (
      categoria.categoriaPadre === null ||
      categoria.categoriaPadre < 1 ||
      categoria.categoriaPadre === undefined
    ) {
      // Es categoria raiz
      return (
        <>
          {
            <CategoriaSeleccionada
              categoriaSeleccionada={categoria}
              categoriaActual={categoriaSeleccionada}
              setCategoriaSeleccionada={setCategoriaSeleccionada}
            />
          }
        </>
      );
    } else {
      let categoriaPadre = categorias.find(
        (c) => c.id === categoria.categoriaPadre
      );
      return (
        <>
          {categoriaPadre && ObtenerCategoriaPadre(categoriaPadre)}
          {
            <CategoriaSeleccionada
              categoriaSeleccionada={categoria}
              categoriaActual={categoriaSeleccionada}
              setCategoriaSeleccionada={setCategoriaSeleccionada}
            />
          }
        </>
      );
    }
  };

  const ListaCategorias = (categoria: ICategoria) => {
    return <>{ObtenerCategoriaPadre(categoria)}</>;
  };

  const filtrarCategorias = (categorias: ICategoria[]) => {};

  const OpcionesDeCategoria = (categoria: ICategoria) => {
    let categoriasHijas: ICategoria[];
    if (categoria.esCategoriaFinal === true) {
      // Es categoria final, debo mostrar pictogramas
      return (
        <>
          <PictogramasPorCategoria
            categoria={categoria.id}
            setPictogramas={UpdatePictogramas}
            pictogramas={pictogramasSeleccionados}
          ></PictogramasPorCategoria>
        </>
      );
    } else {
      // Es categoria padre, debo mostrar categorias

      if (
        (usuarioLogueado?.nivel !== undefined ? usuarioLogueado?.nivel : 0) ===
        3
      ) {
        categoriasHijas = categorias.filter(
          (c) =>
            c.categoriaPadre === categoria.id &&
            (categoriasPorUsuario.some((cxu) => cxu.idCategoria === c.id) ||
              !c.esCategoriaFinal)
        );
      } else {
        categoriasHijas = categorias.filter(
          (c) =>
            c.categoriaPadre === categoria.id &&
            categoria.nivel <=
              (usuarioLogueado?.nivel !== undefined
                ? usuarioLogueado?.nivel
                : 0)
        );
      }
    }

    return (
      <Container maxWidth="xl">
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 10, md: 12 }}
        >
          {categoriasHijas.map((categoria) => {
            return (
              <Grid
                key={categoria.id + '-' + categoria.nombre}
                item
                xs={12}
                sm={4}
                md={2}
              >
                <Container key={categoria.id + '-' + categoria.nombre} maxWidth="xl">
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
    );
  };

  return (
    <div>
      <ResponsiveAppBar />
      {pictogramasSeleccionados && pictogramasSeleccionados.length > 0 && (
        <>
          <Seleccion
            pictogramas={pictogramasSeleccionados}
            setPictogramas={UpdatePictogramas}
          />
          <hr />
        </>
      )}
      {/* TODO: Extraer esto en otro lado para poder mostrar cuanto descargo el updateService */}
      {/* <CircularProgress variant="determinate" value={downloadPercentage} /> */}

      <Recientes
        setPictogramas={UpdatePictogramas}
        pictogramas={pictogramasSeleccionados}
      />
      {pictogramasSeleccionados &&
        pictogramasSeleccionados.length > 0 &&
        pictogramasPredecidos &&
        pictogramasPredecidos.length > 0 &&
        pictogramasPredecidos[0] && (
          <Sugeridos
            setPictogramas={UpdatePictogramas}
            pictogramas={pictogramasSeleccionados}
            pictogramasPredecidos={pictogramasPredecidos}
          />
        )}

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
        alignItems="center"
        justifyContent="center"
        style={{marginTop:0}}
      >
        <Grid key="Filtros" item xs={12} sm={4} md={2}>
          <TextField
            id="input-tag-filter"
            label="Filtrar pictogramas por palabra clave o categoria"
            variant="standard"
            style={{ marginBottom: 5, width: '100%' }}
            onChange={(event) => {
              //TODO: Revisar obtencion de pictogramas propios
              filtrarPictogramas(event.target.value);
            }}
          />
        </Grid>
        <Grid key="Creacion" item xs={12} sm={4} md={2}>
          <FormDialog />
        </Grid>
      </Grid>
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
                        if (pictogramasSeleccionados) {
                          let pictogramasSel = [...pictogramasSeleccionados];
                          if (pictogramasSel !== null) {
                            pictogramasSel.push(pictograma);
                            LearnAndPredict(pictogramasSel);
                            setPictogramasSeleccionados(pictogramasSel);
                          }
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        src={
                          pictograma.imagen &&
                          pictograma.imagen.includes('data:image')
                            ? pictograma.imagen
                            : `data:image/png;base64,${pictograma.imagen}`
                        }
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
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
        style={{ marginTop: 5 }}
      >
        {/* TODO: Mejorar diseño */}
        {categoriaSeleccionada && ListaCategorias(categoriaSeleccionada)}
        {categoriaSeleccionada && OpcionesDeCategoria(categoriaSeleccionada)}
      </Grid>
      <br />
      {/* TODO: Agregar algun separador para separar las raices */}
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
