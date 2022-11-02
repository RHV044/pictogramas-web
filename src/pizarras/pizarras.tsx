import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from './draggableBox';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import ResponsiveAppBar from '../commons/appBar';
import { CellDrop, cellDropStyle } from './cellDrop';
import { Trash } from './trash';
import { Grafico, Movimientos, Position } from './movimientos';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  ObtenerCategorias,
  ObtenerPictogramas,
} from '../pictogramas/services/pictogramas-services';
import { ICategoria } from '../pictogramas/models/categoria';
import CategoriasRaices from '../pictogramas/components/categorias/categoriasRaices';
import CategoriaSeleccionada from '../pictogramas/components/categorias/categoriaSeleccionada';
import PictogramasPorCategoria from '../pictogramas/components/categorias/pictogramasPorCategoria';
import { IndexedDbService } from '../services/indexeddb-service';
import EstilosFormDialog from './personalizacion';
import GuardarPizarra from './guardarPizarra';
import CargarPizarra from './cargarPizarra';
import { ObtenerPizarras } from './services/pizarras-services';
import { ICeldaPizarra, IPizarra } from './models/pizarra';
import {
  getUsuarioLogueado,
  setUsuarioLogueadoVariable,
  usuarioLogueado,
} from '../services/usuarios-services';
import Categoria from '../pictogramas/components/categorias/categoria';
import { useLocation, useNavigate } from 'react-router-dom';

export type EstilosPizarras = {
  fila: number;
  columna: number;
  color: string;
};

export default function Pizarras(this: any) {
  let navigate = useNavigate();
  let location = useLocation();
  const [filas, setFilas] = useState(0);
  const [columnas, setColumnas] = useState(0);
  const [texto, setTexto] = useState('');
  const movimientos = useMemo(() => new Movimientos(), []);
  //const movimientos = new Movimientos()
  const [refresco, setRefresco] = useState(false);
  const [mostrarPictogramas, setMostrarPictogramas] = useState(false);
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [pictogramasSeleccionados, setPictogramasSeleccionados] = useState(
    [] as IPictogram[]
  );
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    null as ICategoria | null
  );
  const [graficos, setGraficos] = useState([] as Grafico[]);
  const [, updateState] = useState({});

  const [graficosSinLugar, setGraficosSinLugar] = useState([] as Grafico[]);
  const [pictogramasFiltrados, setPictogramasFiltrados] = useState(
    [] as IPictogram[]
  );
  const [db, setDb] = useState(IndexedDbService.create());
  const [estilos, setEstilos] = useState([] as EstilosPizarras[]);
  const [cargando, setCargando] = useState(false);
  const [nombrePizarra, setNombrePizarra] = useState('' as string);
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [pizarra, setPizarra] = useState({} as IPizarra);

  useEffect(() => {
    dispatchEvent(new CustomEvent('sincronizar'));
    getUsuarioLogueado().then((usuario) => {
      if (usuario === null || usuario === undefined) {
        // Redirijo a seleccionar cuenta
        navigate('/cuenta/seleccionar' + location.search);
      } else {
        setUsuarioLogueadoVariable(usuario);
      }
    });

    ObtenerPictogramas().then((pictogramas) => {
      setPictogramas(pictogramas);
    });
    ObtenerCategorias(setCategorias);
  }, []);

  useEffect(() => {}, [graficos]);

  useEffect(() => {
    setCargando(false);
  }, [graficosSinLugar]);

  useEffect(() => {
    actualizarEstilos();
  }, [columnas]);

  useEffect(() => {
    actualizarEstilos();
  }, [filas]);

  useEffect(() => {}, [estilos]);

  const handleChange = () => {
    let graf = [...movimientos.getGraficos()];
    setGraficos([...graf]);
    setGraficosSinLugar([...graf]);
    if (!compararListas(graficos, graficosSinLugar)) {
      let grafs = [...graficos];
      setGraficosSinLugar([...grafs]);
    }
  };

  const compararListas = (array1: Grafico[], array2: Grafico[]) => {
    if (array1.length !== array2.length) return false;
    for (var i = 0; i < array2.length; i++) {
      if (
        array1.some(
          (g) =>
            g.identificacion === array2[i].identificacion &&
            (g.posicion.columna !== array2[i].posicion.columna ||
              g.posicion.fila !== array2[i].posicion.fila)
        )
      ) {
        return false;
      }
    }
    return true;
  };

  const UpdatePictogramas = (pics: IPictogram[]) => {
    let pictogramaParaAgregar = pics[0];
    movimientos.agregarPictograma(pictogramaParaAgregar);
    setPictogramasSeleccionados([]);
    handleChange();
  };

  function agregarTexto() {
    setTexto('');
    let grafico = {
      esPictograma: false,
      imagen: '',
      posicion: { columna: -1, fila: -1 },
      texto: texto,
      identificacion: Date.now().toString(),
    } as Grafico;
    movimientos.agregarGrafico(grafico);
  }

  const filtrarPictogramas = async (value: string) => {
    if (value === '' || value === null) {
      console.log('no hay mas pictogramas filtrados');
      setPictogramasFiltrados([]);
    } else {
      let pictsFiltrados = pictogramas
        .filter(
          (p) =>
            p.keywords.some((k) => k.keyword.includes(value)) === true ||
            p.categorias?.some((c) => c.nombre.includes(value)) === true
        )
        .slice(0, 5);
      //TODO: Revisar obtencion de pictogramas propios
      await Promise.all(
        pictsFiltrados.map(async (p) => {
          let imagen = await db.then((x) => x.getValue('imagenes', p.id));
          p.imagen = imagen.imagen;
        })
      );
      setPictogramasFiltrados(pictsFiltrados);
    }
  };

  const nuevosEstilos = (nuevosEstilos: EstilosPizarras[]) => {
    setEstilos(nuevosEstilos);
  };

  const actualizarEstilos = () => {
    let est = [] as EstilosPizarras[];
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < columnas; c++) {
        if (estilos.some((e) => e.columna === c && e.fila === f)) {
          let nuevoEstilo = estilos.find(
            (e) => e.columna === c && e.fila === f
          );
          if (nuevoEstilo) est.push(nuevoEstilo);
        } else est.push({ color: '#fff', columna: c, fila: f }); //#fff -> blanco - #1ed080 -> verdecito
      }
    }
    setEstilos(est);
  };

  const obtenerEstilo = (fila: number, columna: number) => {
    let c = estilos.find(
      (e) => e.columna === columna && e.fila === fila
    )?.color;
    return c;
  };

  const obtenerPizarraActual = () => {
    let graficosActuales = movimientos.getGraficos();
    let estilosActuales = estilos;
    let celdas = [] as ICeldaPizarra[];
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < columnas; c++) {
        let grafico = graficosActuales.find(
          (g) => g.posicion.columna === c && g.posicion.fila === f
        );
        if (grafico !== undefined && grafico !== null) {
          let celda = {
            fila: f,
            columna: c,
            tipoContenido:
              grafico.esPictograma === true ? 'pictograma' : 'texto',
            contenido:
              grafico.esPictograma === true
                ? grafico.identificadorPictograma
                  ? grafico.identificadorPictograma
                  : grafico.idPictograma.toString()
                : grafico.texto,
            color: estilosActuales.find(
              (est) => est.columna === c && est.fila === f
            )?.color,
            identificacion: grafico.identificacion,
          } as ICeldaPizarra;
          celdas.push(celda);
        } else {
          let celda = {
            fila: f,
            columna: c,
            tipoContenido: 'vacio',
            contenido: '',
            color: estilosActuales.find(
              (est) => est.columna === c && est.fila === f
            )?.color,
          } as ICeldaPizarra;
          celdas.push(celda);
        }
      }
    }
    graficosSinLugar.forEach((grafico) => {
      if (grafico.posicion.columna === -1 && grafico.posicion.fila === -1) {
        let celda = {
          fila: -1,
          columna: -1,
          tipoContenido: grafico.esPictograma === true ? 'pictograma' : 'texto',
          contenido:
            grafico.esPictograma === true
              ? grafico.identificadorPictograma
                ? grafico.identificadorPictograma
                : grafico.idPictograma.toString()
              : grafico.texto,
          color: '',
          identificacion: grafico.identificacion,
        } as ICeldaPizarra;
        celdas.push(celda);
      }
    });
    let pizarraActual = {
      id: pizarra.id,
      filas: filas,
      columnas: columnas,
      usuarioId: usuarioLogueado?.id,
      celdas: celdas,
      nombre: nombrePizarra,
    } as IPizarra;
    return pizarraActual;
  };

  const setPizarraActual = async (pizarra: IPizarra) => {
    console.log('pizarra cargada: ', pizarra);
    setCargando(true);
    setFilas(pizarra.filas);
    setColumnas(pizarra.columnas);
    setNombrePizarra(pizarra.nombre);
    setPizarra(pizarra);
    movimientos.eliminarGraficos();
    let nuevosGraficosSinLugar = [] as Grafico[];
    await db.then(async (base) => {
      let nuevosEstilos = [] as EstilosPizarras[];
      pizarra.celdas.forEach(async (celda) => {
        let imagenPictograma;
        if (celda.tipoContenido === 'pictograma') {
          try {
            let pictograma = (imagenPictograma = await base.getValue(
              'imagenes',
              parseInt(celda.contenido)
            ));
            if (pictograma) imagenPictograma = pictograma.imagen;
          } catch (e) {}
          if (imagenPictograma === null || imagenPictograma === undefined) {
            let pictogramaPropio = await base.getValueByIdentificador(
              'pictogramasPropios',
              celda.contenido
            );
            if (pictogramaPropio) imagenPictograma = pictogramaPropio.imagen;
          }
        }
        if (
          celda.tipoContenido === 'texto' ||
          celda.tipoContenido === 'pictograma'
        ) {
          let grafico = {
            esPictograma: celda.tipoContenido === 'pictograma' ? true : false,
            imagen:
              celda.tipoContenido === 'pictograma' ? imagenPictograma : '',
            texto: celda.tipoContenido === 'texto' ? celda.contenido : '',
            posicion: { columna: celda.columna, fila: celda.fila } as Position,
            identificacion: celda.identificacion,
          } as Grafico;
          movimientos.agregarGrafico(grafico);
          nuevosGraficosSinLugar.push(grafico);
        }
        let estilo = {
          color: celda.color,
          columna: celda.columna,
          fila: celda.fila,
        } as EstilosPizarras;
        nuevosEstilos.push(estilo);
      });

      setEstilos(nuevosEstilos);
      handleChange();
      setTimeout(function () {
        handleChange();
      }, 500);
    });
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

  const OpcionesDeCategoria = (categoria: ICategoria) => {
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
      let categoriasHijas = categorias.filter(
        (c) => c.categoriaPadre === categoria.id
      );
      return (
        <Container>
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
      );
    }
  };

  return (
    <div>
      <ResponsiveAppBar />
      <Container>
        <Container
          style={{
            display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          <TextField
            style={{ marginLeft: 5 }}
            label="Filas"
            id="outlined-size-small"
            value={filas}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(evt) => {
              let cantidad = parseInt(evt?.target?.value);
              setFilas(cantidad ? cantidad : 0);
            }}
            size="small"
          />
          <TextField
            style={{ marginLeft: 5 }}
            label="Columnas"
            id="outlined-size-small"
            value={columnas}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(evt) => {
              let cantidad = parseInt(evt?.target?.value);
              setColumnas(cantidad ? cantidad : 0);
            }}
            size="small"
          />
        </Container>
        <Stack direction="row" spacing={2} style={{ marginTop: 5 }}>
          {/* <Grid
          container
          // justifyContent="center"
          // alignItems="center"
          style={{ marginLeft: 1 }}
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        > */}
          {/* <Grid key="Estilos" item xs={2} sm={4} md={3}> */}
          <EstilosFormDialog
            filas={filas}
            columnas={columnas}
            estilos={[...estilos]}
            actualizarEstilos={nuevosEstilos}
          />
          {/* </Grid>
          <Grid key="Guardar" item xs={2} sm={4} md={3}> */}
          <GuardarPizarra
            obtenerPizarra={obtenerPizarraActual}
            nombrePizarra={nombrePizarra}
          />
          {/* </Grid>
          <Grid key="Cargar" item xs={2} sm={4} md={3}> */}
          <CargarPizarra setPizarra={setPizarraActual} />
          {/* </Grid>
        </Grid> */}
        </Stack>
      </Container>
      <br />
      {!cargando && (
        <Table component={Paper}>
          <Table
            sx={{ width: '100%', height: '100%' }}
            aria-label="simple table"
          >
            <TableHead></TableHead>
            <TableBody>
              {Array.from(Array(filas), (e, f) => {
                return (
                  <TableRow key={f}>
                    {Array.from(Array(columnas), (d, c) => {
                      return (
                        <TableCell
                          key={f + '-' + c}
                          style={{
                            minHeight: 30,
                            maxHeight: 80,
                            minWidth: 30,
                            maxWidth: 80,
                          }}
                        >
                          <div
                            style={{
                              overflow: 'hidden',
                              clear: 'both',
                              backgroundColor: obtenerEstilo(f, c),
                              minHeight: 120,
                              maxHeight: 240,
                              minWidth: 120,
                              maxWidth: 240,
                              paddingBottom: 6,
                              paddingLeft: 6,
                              paddingRight: 1,
                              paddingTop: 6,
                            }}
                          >
                            {' '}
                            {/* backgroundColor: 'green', ...cellDropStyle */}
                            <CellDrop
                              fila={f}
                              columna={c}
                              name="celda"
                              onDrop={() => {}}
                              movimientos={movimientos}
                            />
                            {/* <CellDrop fila={f} columna={c} name='celda' onDrop={() => {handleChange() }} movimientos={movimientos} /> */}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Table>
      )}
      <Container
        style={{
          display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        {!cargando &&
          graficosSinLugar.map((grafico) => {
            if (
              grafico.posicion.columna === -1 &&
              grafico.posicion.fila === -1
            ) {
              if (grafico.esPictograma === false)
                return (
                  <Container
                    style={{
                      display: 'flex',
                      // alignItems: 'center',
                      // justifyContent: 'center',
                      marginTop: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Box
                      name={grafico.texto}
                      key={grafico.identificacion}
                      movimientos={movimientos}
                      identificacion={grafico.identificacion}
                      fila={-1}
                      columna={-1}
                      esPictograma={false}
                      imagen={''}
                      onDrop={() => {
                        handleChange();
                      }}
                    />
                  </Container>
                );
              //fila={-1} columna={-1} esPictograma={false} imagen={''} onDrop={() => { }}/>)
              else
                return (
                  <Container
                    style={{
                      display: 'flex',
                      // alignItems: 'center',
                      // justifyContent: 'center',
                      marginTop: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Box
                      name={grafico.texto}
                      key={grafico.identificacion}
                      movimientos={movimientos}
                      identificacion={grafico.identificacion}
                      fila={-1}
                      columna={-1}
                      esPictograma={true}
                      imagen={grafico.imagen}
                      onDrop={() => {
                        handleChange();
                      }}
                    />
                  </Container>
                );
              //fila={-1} columna={-1} esPictograma={true} imagen={grafico.imagen} onDrop={() => { }}/>)
            }
          })}
        {refresco && <></>}
      </Container>
      <Container
        style={{
          display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        <Trash
          movimientos={movimientos}
          name="Tachito"
          onDrop={(evt) => {
            handleChange();
            console.log(evt);
          }}
        />
      </Container>
      <hr></hr>
      <Container
        style={{
          display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        <TextField
          style={{ marginLeft: 5 }}
          label="Texto para agregar"
          id="outlined-size-small"
          value={texto}
          onChange={(evt) => setTexto(evt?.target?.value)}
          size="small"
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              agregarTexto();
              handleChange();
            }
          }}
        />
        <Button
          style={{ marginLeft: 5, marginRight: 5 }}
          variant="contained"
          component="label"
          onClick={() => {
            agregarTexto();
            handleChange();
          }}
        >
          Agregar Texto
        </Button>
      </Container>

      {pictogramas.length > 0 && (
        <Container
          style={{
            display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          <Switch
            checked={mostrarPictogramas}
            onChange={(evt) => setMostrarPictogramas(evt?.target?.checked)}
          />{' '}
          Mostrar Pictogramas
        </Container>
      )}
      {mostrarPictogramas && <hr></hr>}
      {mostrarPictogramas && (
        <Container
          style={{
            display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          <TextField
            style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }}
            label="Buscar Pictograma"
            id="outlined-size-small"
            onChange={(evt) => {
              //TODO: No esta obteniendo pictogramas propios
              filtrarPictogramas(evt.target.value);
            }}
            size="small"
          />
        </Container>
      )}
      
      <Container>
        { pictogramasFiltrados.length > 0 && 
          <Typography>
            Seleccione pictogramas para agregar en el tablero
          </Typography>
        }
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 10, md: 12 }}
          style={{ marginTop: 2, marginBottom: 2 }}
        >
          {pictogramasFiltrados.map((pictograma) => {
            return (
              <Grid key={pictograma.id} item xs={12} sm={4} md={2}>
                <Container key={pictograma.id}>
                  <Card
                    sx={{
                      maxWidth: 225,
                      minWidth: 50,
                      maxHeight: 225,
                      minHeight: 50,
                    }}
                    style={{ marginTop: '10px' }}
                    onClick={() => {}}
                  >
                    <CardActionArea
                      onClick={() => {
                        let pictogramasSel = [...pictogramasSeleccionados];
                        if (pictogramasSel !== null) {
                          pictogramasSel.push(pictograma);
                          UpdatePictogramas(pictogramasSel);
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        width="160"
                        src={
                          pictograma.imagen &&
                          pictograma.imagen.includes('data:image')
                            ? pictograma.imagen
                            : `data:image/png;base64,${pictograma.imagen}`
                        }
                        alt={pictograma.keywords[0].keyword}
                      ></CardMedia>
                      <CardHeader></CardHeader>
                      <CardContent
                        style={{
                          marginTop: 1,
                          paddingTop: 0,
                          marginLeft: 4,
                          paddingLeft: 0,
                          fontWeight: 'bold',
                        }}
                      >
                        {pictograma.keywords[0].keyword.toLocaleUpperCase()}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Container>
              </Grid>
            );
          })}
        </Grid>
      </Container>
      {mostrarPictogramas && <hr></hr> }
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
        style={{ marginTop: 2, marginBottom: 2 }}
      >
        {mostrarPictogramas &&
          categoriaSeleccionada &&
          ListaCategorias(categoriaSeleccionada)}
        {mostrarPictogramas &&
          categoriaSeleccionada &&
          OpcionesDeCategoria(categoriaSeleccionada)}
      </Grid>
      {mostrarPictogramas && (
        <div>
          <CategoriasRaices
            setPictogramas={UpdatePictogramas}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
        </div>
      )}
    </div>
  );
}
