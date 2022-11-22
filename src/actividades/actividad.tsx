import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ResponsiveAppBar from '../commons/appBar';
import { ICategoria } from '../pictogramas/models/categoria';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  ObtenerCategoriasIndexDB,
  ObtenerPictogramas,
  PictogramaNoSeDebeTraducir,
} from '../pictogramas/services/pictogramas-services';
import { IndexedDbService } from '../services/indexeddb-service';
import { useSpeechSynthesis } from 'react-speech-kit';
import { verificarValidezDeCategoria } from '../pictogramas/components/categorias/categoriasRaices';
import { ICategoriaPorUsuario } from '../pictogramas/models/categoriaPorUsuario';
import { getUsuarioLogueado } from '../services/usuarios-services';
import { IUsuario } from '../login/model/usuario';

export default function Actividad() {
  let navigate = useNavigate();
  let location = useLocation();
  const params = useParams();
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [categorias, setCategorias] = useState([] as ICategoria[]);

  const [categoria1, setCategoria1] = useState(null as ICategoria | null);
  const [categoria2, setCategoria2] = useState(null as ICategoria | null);
  const [categoria3, setCategoria3] = useState(null as ICategoria | null);
  const [categoria4, setCategoria4] = useState(null as ICategoria | null);
  const [pictograma, setPictograma] = useState(null as IPictogram | null);
  const [categoriaCorrecta, setCategoriaCorrecta] = useState({} as ICategoria);
  const [resultadoCorrecto, setResultadoCorrecto] = useState(false);
  const [resultadoIncorrecto, setResultadoIncorrecto] = useState(false);
  const [pictogramaCargado, setPictogramaCargado] = useState(false);
  const [categoriasReorganizadas, setCategoriasReorganizadas] = useState(false);
  const [racha, setRacha] = useState(0);
  const { speak } = useSpeechSynthesis();
  const [categoriasPorUsuario, setCategoriasPorUsuario] = useState(
    [] as ICategoriaPorUsuario[]
  );
  const [user, setUser] = useState(null as IUsuario | null);

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = () => {
    setPictogramaCargado(false);
    setCategoriasReorganizadas(false);
    getUsuarioLogueado().then((usuario) => {
      if(usuario === null || usuario === undefined){
        // Redirijo a seleccionar cuenta
        navigate('/cuenta/seleccionar' + location.search);
      } else {
        setUser(usuario);
        console.log('USUARIO: ', usuario);
        if((user?.nivel !== undefined ? user?.nivel : 0) === 3){
          console.log('Nivel personalizado');
          IndexedDbService.create().then(async (db) => {
            await db.searchCategoriasPorUsuarioByUser((user && user.id) ? user.id : 0).then(cxus => {
              cxus = cxus.filter(c => !c.pendienteEliminar);
              setCategoriasPorUsuario(cxus);
            })});
          console.log('categoriasPorUsuario seteadas: ', categoriasPorUsuario);
            ObtenerCategoriasIndexDB().then(async (cats) => {
              //setCategorias(cats);
              let categoriasValidadas : ICategoria[] = [];
              console.log('categorias: ', cats);
              cats.forEach(c => {
                if(verificarValidezDeCategoria(c,cats,categoriasPorUsuario, user)){
                  categoriasValidadas.push(c);
                }                
              });
              console.log('categorias en base a la validez obtenidas: ', categoriasValidadas);              
              setCategorias(categoriasValidadas.filter((c :ICategoria) => c.nombre !== "Vocabulario nuclear" && c.nombre !== "Vocabulario central").sort(() => (Math.random() > 0.5 ? 1 : -1)));
              ObtenerPictogramas().then((pics: IPictogram[]) => {
                let picsArasaac = pics.filter((p) => p.idArasaac > 0);
                setPictogramas(picsArasaac);
              });
            });
        } else {
          ObtenerCategoriasIndexDB().then((cats) => {            
            let categoriasParaUsuario = cats.filter(c => c.nivel <=  (user === undefined || user === null || user?.nivel === undefined ? 0 : user?.nivel)); //TODO chequear si dejo ese valor en 0 o en 1 para que por lo menos matchee con algo
            setCategorias(categoriasParaUsuario.filter((c :ICategoria) => c.nombre !== "Vocabulario nuclear" && c.nombre !== "Vocabulario central").sort(() => (Math.random() > 0.5 ? 1 : -1)));
            ObtenerPictogramas().then((pics: IPictogram[]) => {
              let picsArasaac = pics.filter((p) => p.idArasaac > 0);
              setPictogramas(picsArasaac);
            });
          });
        }
      }
    }) 
  };

  useEffect(() => {
    setCategoria1(categorias[0]);
    setCategoriaCorrecta(categorias[0]);
    setCategoria2(categorias[1]);
    if (params.nivel !== undefined && parseInt(params.nivel) > 1)
      setCategoria3(categorias[2]);
    if (params.nivel !== undefined && parseInt(params.nivel) > 2)
      setCategoria4(categorias[3]);
  }, [categorias]);

  const obtenerPictograma =  () =>{
    return pictogramas
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .find((p: IPictogram) => p.categorias
      ?.sort(() => (Math.random() > 0.5 ? 1 : -1))
      .some(
        (c) => c.id === categoria1?.id &&
          c.id !== categoria2?.id &&
          c.id !== categoria3?.id &&
          c.id !== categoria4?.id
      )
    );
  }

  useEffect(() => {
    dispatchEvent(new CustomEvent('sincronizar'));
    let pic = obtenerPictograma();
    //Obtener Imagen de pictograma
    IndexedDbService.create().then(async (db) => {
      if (pic !== undefined) {
        let imagen = await db.getValue('imagenes', pic?.id);
        pic.imagen =
          imagen !== undefined && imagen !== null ? imagen.imagen : '';
        setPictograma(pic);
        setPictogramaCargado(true);
              // Reordenar al azar las categorias:
        var categoriasFinales = [categoria1, categoria2];
        if (params.nivel !== undefined && parseInt(params.nivel) > 1)
          categoriasFinales = categoriasFinales.concat([categoria3]);
        if (params.nivel !== undefined && parseInt(params.nivel) > 2)
          categoriasFinales = categoriasFinales.concat([categoria4]);
        var categoriasReorganizadas = categoriasFinales.sort(() =>
          Math.random() > 0.5 ? 1 : -1
        );
        setCategoria1(categoriasReorganizadas[0]);
        setCategoria2(categoriasReorganizadas[1]);
        if (params.nivel !== undefined && parseInt(params.nivel) > 1)
          setCategoria3(categoriasReorganizadas[2]);
        if (params.nivel !== undefined && parseInt(params.nivel) > 2)
          setCategoria4(categoriasReorganizadas[3]);

        setCategoriasReorganizadas(true);
      }
      else {
        inicializar()
      }
    });
  }, [pictogramas]);

  const cargarNuevoJuego = () => {
    inicializar();
    // navigate('/actividad/' + params.nivel + location.search);
  };

  const verificar = (idCategoria: number, categoria: string) => {
    if (idCategoria === categoriaCorrecta.id) {
      setRacha(racha + 1);
      setResultadoCorrecto(true);
      speak({ text: categoria + ', Correcto' });
      setTimeout(function () {
        cargarNuevoJuego();
        setResultadoCorrecto(false);
      }, 1500);
    } else {
      setRacha(0);
      setResultadoIncorrecto(true);
      speak({ text: categoria + ', Incorrecto' });
      setTimeout(function () {
        setResultadoIncorrecto(false);
      }, 1500);
    }
  };

  const renderCategoria = (categoria: ICategoria) => {
    return (
      <div>
        <Card
          sx={{ maxWidth: 240, minWidth: 100, maxHeight: 240, minHeight: 100 }}
          style={{ marginTop: '10px', paddingLeft: 5, paddingRight: 5, paddingBottom: 20  }}
          onClick={() => {}}
        >
          <CardActionArea
            onClick={() => {
              verificar(categoria.id, categoria.nombre);
            }}
          >
            <CardMedia
              component="img"
              style={{ height: 180, width: 180 }}
              src={
                categoria.imagen && categoria.imagen.includes('data:image')
                  ? categoria.imagen
                  : `data:image/png;base64,${categoria.imagen}`
              }
              alt={categoria.nombre}
            ></CardMedia>
            <CardHeader
              style={{
                height: '100%',
                width: '95%',
                marginBottom: 1,
                paddingBottom: 0,
              }}
            ></CardHeader>
            <CardContent
              style={{
                marginTop: 1,
                paddingTop: 0,
                marginLeft: 4,
                paddingLeft: 0,
                fontWeight: 'bold',
              }}
            >
              {categoria.nombre.toLocaleUpperCase()}
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  };

  return (
    <div>
      {categoria1 && categoria2 && pictograma && (
        <div>
          <ResponsiveAppBar />
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Determine la categoría del pictograma
            </Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Nivel {params.nivel} - Racha actual: {racha}
            </Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              style={{ marginLeft: 5, marginRight: 5 }}
              variant="contained"
              component="label"
              onClick={() => {
                navigate('/actividades' + location.search);
              }}
            >
              Volver a seleccion de nivel
            </Button>
          </Box>
          {resultadoCorrecto ? (
            <Alert severity="success">Correcto!</Alert>
          ) : (
            <></>
          )}
          {resultadoIncorrecto ? (
            <Alert severity="error">Incorrecto</Alert>
          ) : (
            <></>
          )}
          <br />
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Categorías:
            </Typography>
          </Box>
          {categoriasReorganizadas && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              style={{ marginLeft: 1 }}
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid key={categoria1.id} item xs={2} sm={4} md={3}>
                {renderCategoria(categoria1)}
              </Grid>
              <Grid key={categoria2.id} item xs={2} sm={4} md={3}>
                {renderCategoria(categoria2)}
              </Grid>
              {params.nivel !== undefined &&
                parseInt(params.nivel) > 1 &&
                categoria3 !== null && (
                  <Grid key={categoria3.id} item xs={2} sm={4} md={3}>
                    {renderCategoria(categoria3)}
                  </Grid>
                )}
              {params.nivel !== undefined &&
                parseInt(params.nivel) > 2 &&
                categoria4 !== null && (
                  <Grid key={categoria4.id} item xs={2} sm={4} md={3}>
                    {renderCategoria(categoria4)}
                  </Grid>
                )}
            </Grid>
          )}

          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Pictograma:
            </Typography>
          </Box>
          {pictogramaCargado && (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Card
                sx={{
                  maxWidth: 250,
                  minWidth: 160,
                  maxHeight: 250,
                  minHeight: 75,
                }}
                style={{ marginTop: '10px', paddingLeft: 5, paddingRight: 5, paddingBottom: 20  }}
              >
                <CardActionArea
                  onClick={() =>
                    speak({ text: pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords[0].keyword.toLocaleUpperCase() })
                  }
                >
                  <CardMedia
                    component="img"
                    height="180"
                    width="180"
                    src={
                      pictograma.imagen &&
                      pictograma.imagen.includes('data:image')
                        ? pictograma.imagen
                        : `data:image/png;base64,${pictograma.imagen}`
                    }
                    alt={pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords[0].keyword.toLocaleUpperCase()}
                  ></CardMedia>
                  <CardHeader
                    style={{
                      height: '100%',
                      width: '95%',
                      marginBottom: 1,
                      paddingBottom: 0,
                    }}
                  ></CardHeader>
                  <CardContent
                    style={{
                      marginTop: 1,
                      paddingTop: 0,
                      marginLeft: 4,
                      paddingLeft: 0,
                      fontWeight: 'bold',
                    }}
                  >
                    {pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords[0].keyword.toLocaleUpperCase()}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          )}
        </div>
      )}
    </div>
  );
}
