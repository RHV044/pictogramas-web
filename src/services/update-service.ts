import { ICategoria } from '../pictogramas/models/categoria';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  EliminarPictogramaFavorito,
  EliminarPictogramaPropio,
  GuardarPictogramaFavorito,
  ObtenerInformacionPictogramas,
  ObtenerTotalCategorias,
  ObtenerTotalImagenesPictogramas,
  ObtenerTotalPictogramas,
  ObtenerYGuardarCategorias,
} from '../pictogramas/services/pictogramas-services';
import { IndexedDbService } from './indexeddb-service';
import axios from 'axios';
import {
  IPictogramaImagen,
  IPictogramaPropioImagen,
} from '../pictogramas/models/pictogramaImagen';
import {
  ActualizarUsuario,
  EliminarCategoriasPorUsuario,
  getUsuarioLogueado,
  GuardarEstadistica,
  InsertarCategoriasPorUsuario,
  ObtenerCategoriasPorUsuario,
  ObtenerFavoritosDeUsuario,
  ObtenerPictogramasRecientes,
  ObtenerUsuarioInfo,
  SubirInformacionPictogramaPropio,
} from './usuarios-services';
import { IPizarra } from '../pizarras/models/pizarra';
import {
  ActualizarPizarra,
  EliminarPizarra,
  ObtenerPizarras,
} from '../pizarras/services/pizarras-services';
import { GuardarPizarra } from '../pizarras/services/pizarras-services';
import { IUsuario } from '../login/model/usuario';
import { IFavoritoPorUsuario, IFavoritoPorUsuarioApi } from '../pictogramas/models/favoritoPorUsuario';
import { ICategoriaPorUsuario, ICategoriaPorUsuarioApi } from '../pictogramas/models/categoriaPorUsuario';

const apiPictogramas =
  process.env.REACT_APP_URL_PICTOGRAMAS ?? 'http://localhost:5000';

type MyState = {
  categorias: ICategoria[];
  categoriasDescargadas: boolean;
  pictogramasDescargados: boolean;
  imagenesDescargadas: boolean;
  iniciando: boolean;
  actualizacionPizarras: boolean;
  actualizacionUsuarios: boolean;
  actualizacionPictogramas: boolean;
  actualizacionFavoritos: boolean;
  actualizacionEstadisticas: boolean;
  actualizacionCategoriasPorUsuario: boolean;
  actualizacionRecientes: boolean;
};

export class UpdateService {
  state: MyState = {
    categorias: [],
    categoriasDescargadas: false,
    pictogramasDescargados: false,
    imagenesDescargadas: false,
    iniciando: false,
    actualizacionPizarras: false,
    actualizacionUsuarios: false,
    actualizacionPictogramas: false,
    actualizacionFavoritos: false,
    actualizacionEstadisticas: false,
    actualizacionCategoriasPorUsuario: false,
    actualizacionRecientes: false,
  };

  constructor() {
    console.log('Inicializando UPDATE SERVICE');
    // this.initialize();
    // this.addEventsListener();
    // this.sincronizar();
  }

  porcentajeDeDescarga() {
    let porcentaje = 5;
    if (this.state.categoriasDescargadas) porcentaje = porcentaje + 15;
    if (this.state.pictogramasDescargados) porcentaje = porcentaje + 20;
    if (this.state.imagenesDescargadas) porcentaje = porcentaje + 60;
    return porcentaje;
  }

  reiniciarState() {
    this.state.categoriasDescargadas = false;
    this.state.pictogramasDescargados = false;
    this.state.imagenesDescargadas = false;
    this.state.iniciando = false;
    this.state.actualizacionPizarras = false;
    this.state.actualizacionUsuarios = false;
    this.state.actualizacionPictogramas = false;
    this.state.actualizacionFavoritos = false;
    this.state.actualizacionEstadisticas = false;
    this.state.actualizacionCategoriasPorUsuario = false;
    this.state.actualizacionRecientes = false;
  }

  async initialize() {
    if (!this.state.iniciando) {
      try {
        this.state.iniciando = true;
        let db = await IndexedDbService.create();
        // TODO: obtener las categorias locales y no el total, y descargar imagen si imagen es vacia
        let totalCategoriasLocales = await db.getAllValues('categorias');
        let totalCategorias = await ObtenerTotalCategorias();
        console.log(
          `Total categorias: ${totalCategorias} vs total categorias locales: ${totalCategoriasLocales}`
        );
        if (totalCategoriasLocales.length < totalCategorias) {
          await ObtenerYGuardarCategorias(async (cats: ICategoria[]) => {
            cats = cats.filter(
              (c) => !totalCategoriasLocales.some((cl) => cl.id === c.id)
            );
            cats.forEach((cat) => {
              if (!cats.some((c) => c.categoriaPadre === cat.id))
                cat.esCategoriaFinal = true;
              else cat.esCategoriaFinal = false;

              cat.imagen = '';
            });
            await db.putBulkValue('categorias', cats);
            // Obtencion imagenes de categorias

            cats = await db.getAllValues('categorias');
            cats = cats.filter(
              (c) => c.imagen.length < 2 || c.imagen.includes('Error')
            );
            const maxParallelRequests = 500;
            let count = 0;
            let start = 0;
            let end = 1;
            while (count < cats.length) {
              end =
                cats.length - count <= maxParallelRequests
                  ? start + (cats.length - count)
                  : start + maxParallelRequests;

              let aGroupOfInfoCats = cats.slice(start, end);
              count += end - start;
              start = end;

              let groupRequestPromises: Promise<any>[] = aGroupOfInfoCats.map(
                // eslint-disable-next-line no-loop-func
                async (cat: ICategoria) => {
                  // Get the pictogram's image
                  return axios
                    .get(
                      `${apiPictogramas}/categorias/${cat.id}/obtener/base64`
                    )
                    .then(async (response) => {
                      if (!response.data.includes('Error')) {
                        cat.imagen = response.data;
                        await db.putOrPatchValue('categorias', cat);
                      }
                    });
                }
              );
            }
          });
        }
        this.state.categoriasDescargadas = true;

        let usuario = await getUsuarioLogueado();
        let totalPictogramasLocales = 1;
        if (usuario != null && usuario !== undefined && usuario.id != null)
          totalPictogramasLocales =
            (await db.countPictogramasDeUsuarioLocales(usuario.id)) +
            (await db.countPictogramasLocales(usuario.id));
        else totalPictogramasLocales = await db.countPictogramasLocales(null);

        let totalPictogramas = await ObtenerTotalPictogramas();
        console.log(
          `Total pictogramas: ${totalPictogramas} vs total pictogramas locales: ${totalPictogramasLocales}`
        );
        let informacion = await ObtenerInformacionPictogramas(); // obtiene pictos de arasaac y de usuario
        let informacionPropios = informacion.filter(
          (p) => p.idUsuario === usuario?.id
        );
        let informacionArasaac = informacion.filter((p) => p.idArasaac > 0);
        if (totalPictogramasLocales < totalPictogramas) {
          db.putBulkValue('pictograms', informacionArasaac);
          db.putBulkValue('pictogramasPropios', informacionPropios);

          // Obtencion imagenes de pictogramas pictogramas propios
          db.getAllValues('pictogramasPropios').then(
            async (pictogramas: IPictogram[]) => {
              if (
                usuario != null &&
                usuario !== undefined &&
                usuario.id != null
              )
                pictogramas = pictogramas.filter(
                  (p) =>
                    (p.idUsuario === null ||
                      p.idUsuario === usuario?.id ||
                      p.idArasaac !== null) &&
                    (p.imagen === '' ||
                      p.imagen === null ||
                      p.imagen === undefined ||
                      p.imagen.includes('Error'))
                );
              else
                pictogramas = pictogramas.filter(
                  (p) =>
                    (p.idUsuario === null || p.idArasaac !== null) &&
                    (p.imagen === '' ||
                      p.imagen === null ||
                      p.imagen === undefined ||
                      p.imagen.includes('Error'))
                );
              const maxParallelRequests = 500;
              let count = 0;
              let start = 0;
              let end = 1;
              while (count < pictogramas.length) {
                end =
                  pictogramas.length - count <= maxParallelRequests
                    ? start + (pictogramas.length - count)
                    : start + maxParallelRequests;

                let aGroupOfInfoPictograms = pictogramas.slice(start, end);
                count += end - start;
                start = end;

                let groupRequestPromises: Promise<any>[] =
                  aGroupOfInfoPictograms.map(
                    // eslint-disable-next-line no-loop-func
                    async (pictoInfo: IPictogram) => {
                      // Get the pictogram's image
                      return axios
                        .get(
                          `${apiPictogramas}/pictogramas/${pictoInfo.id}/obtener/base64`
                        )
                        .then(async (response) => {
                          if (!response.data.includes('Error')) {
                            pictoInfo.imagen = response.data;
                            await db.putOrPatchValue(
                              'pictogramasPropios',
                              pictoInfo
                            );
                          }
                        });
                    }
                  );

                await Promise.all(groupRequestPromises);
              }
            }
          );
        }
        this.state.pictogramasDescargados = true;

        let totalImagenesEnApi = await ObtenerTotalImagenesPictogramas();
        console.log('TOTAL IMAGENES EN STORAGE: ', totalImagenesEnApi.length);
        console.log('IMAGENES EN STORAGE: ', totalImagenesEnApi);
        let totalImagenesLocales = await db.getAllValues('imagenes');
        console.log('IMAGENES LOCALES: ', totalImagenesLocales);
        if (totalImagenesLocales.length < totalImagenesEnApi.length) {
          // Obtencion imagenes de pictogramas arasaac
          db.getAllValues('pictograms').then(
            async (pictogramas: IPictogram[]) => {
              if (
                usuario != null &&
                usuario !== undefined &&
                usuario.id != null
              )
                pictogramas = pictogramas.filter(
                  (p) =>
                    (p.idUsuario === null ||
                      p.idUsuario === usuario?.id ||
                      p.idArasaac !== null) &&
                    (p.imagen === '' ||
                      p.imagen === null ||
                      p.imagen === undefined ||
                      p.imagen.includes('Error'))
                );
              else
                pictogramas = pictogramas.filter(
                  (p) =>
                    (p.idUsuario === null || p.idArasaac !== null) &&
                    (p.imagen === '' ||
                      p.imagen === null ||
                      p.imagen === undefined ||
                      p.imagen.includes('Error'))
                );
              const maxParallelRequests = 500;
              let count = 0;
              let start = 0;
              let end = 1;
              pictogramas = pictogramas.filter(
                (p) =>
                  !totalImagenesLocales.some((imagen) => imagen.id === p.id) &&
                  totalImagenesEnApi.includes(p.id.toString())
              );
              console.log('Pictogramas faltantes de imagenes: ', pictogramas);
              while (count < pictogramas.length) {
                end =
                  pictogramas.length - count <= maxParallelRequests
                    ? start + (pictogramas.length - count)
                    : start + maxParallelRequests;

                let aGroupOfInfoPictograms = pictogramas.slice(start, end);

                count += end - start;
                start = end;

                let groupRequestPromises: Promise<any>[] =
                  aGroupOfInfoPictograms.map(
                    // eslint-disable-next-line no-loop-func
                    async (pictoInfo: IPictogram) => {
                      // Get the pictogram's image
                      return axios
                        .get(
                          `${apiPictogramas}/pictogramas/${pictoInfo.id}/obtener/base64`
                        )
                        .then(async (response) => {
                          if (!response.data.includes('Error')) {
                            let pictogramaImagen = {
                              id: pictoInfo.id,
                              imagen: response.data,
                            } as IPictogramaImagen;
                            // pictoInfo.imagen = response.data
                            pictoInfo.imagen = '';
                            await db.putOrPatchValue('pictograms', pictoInfo);
                            // console.log('se obtuvo la imagen: ', pictoInfo.imagen)
                            await db.putOrPatchValue(
                              'imagenes',
                              pictogramaImagen
                            );
                          }
                        })
                        .catch((err) => {
                          console.log(
                            'No se pudo descargar la imagen del pictograma: ',
                            err
                          );
                        });
                    }
                  );

                await Promise.all(groupRequestPromises);
              }
            }
          );
        }
        this.state.imagenesDescargadas = true;

        this.state.iniciando = false;
      } catch (ex) {
        console.log('OCURRIO UN ERROR INICIALIZANDO UPDATE SERVICE');
        this.state.categoriasDescargadas = true;
        this.state.pictogramasDescargados = true;
        this.state.imagenesDescargadas = true;
        this.state.iniciando = false;
      }
    }
  }

  async addEventsListener() {
    window.addEventListener('online', () => {
      console.log('Hay conexion');
      this.sincronizar();
    });
    window.addEventListener('sincronizar', () => {
      console.log('EVENTO SINCRONIZAR');
      this.sincronizar();
    });
    window.addEventListener('offline', () => {
      console.log('Se perdio la conexion');
    });
  }

  async sincronizar() {
    try {
      if (
        window.navigator.onLine &&
        //TODO: Remover la depencencia del iniciando, esta puesta para evitar explotar la VM ahora que tiene problemas de memoria
        // !this.state.iniciando &&
        !this.state.actualizacionPictogramas &&
        !this.state.actualizacionFavoritos &&
        !this.state.actualizacionPizarras &&
        !this.state.actualizacionUsuarios &&
        !this.state.actualizacionEstadisticas &&
        !this.state.actualizacionRecientes
      ) {
        this.state.actualizacionPictogramas = true;
        this.state.actualizacionFavoritos = true;
        this.state.actualizacionPizarras = true;
        this.state.actualizacionUsuarios = true;
        this.state.actualizacionEstadisticas = true;
        this.state.actualizacionRecientes = true;
        this.actualizarPizarras();
        this.actualizarUsuarios();
        this.actualizarPictogramas();
        this.actualizarFavoritos();
        this.actualizarEstadisticas();
        this.actualizarCategoriasPorUsuarios();
        this.actualizarRecientes();
      }
    } catch (ex) {
      this.state.actualizacionPictogramas = false;
      this.state.actualizacionFavoritos = false;
      this.state.actualizacionPizarras = false;
      this.state.actualizacionUsuarios = false;
      this.state.actualizacionEstadisticas = false;
      this.state.actualizacionRecientes = false;
    }
  }

  async actualizarEstadisticas() {
    try {
      IndexedDbService.create().then((db) => {
        db.getAllValues('historicoUsoPictogramas').then(
          async (registros: any[]) => {
            registros.map(async (registro) => {
              if (registro.id && registro.id !== 0) {
                //No es el categorize, lo debo guardar en la api y luego borrarlo
                await GuardarEstadistica(registro);
                await db.deleteValue(
                  'historicoUsoPictogramas',
                  registro.id.toString()
                );
              }
            });
            this.state.actualizacionEstadisticas = false;
          }
        );
      });
    } catch (ex) {
      this.state.actualizacionEstadisticas = false;
    }
  }

  async actualizarRecientes() {
    try {
      let usuario = await getUsuarioLogueado();
      let usuarioId = usuario !== undefined ? usuario.id : 0;
      IndexedDbService.create().then(async (db) => {
        let recientes = await ObtenerPictogramasRecientes(10, usuarioId);
        db.getAllValues('recientes').then(async (registros: any[]) => {
          recientes.forEach(async (reciente) => {
            await db.putOrPatchValue('recientes', reciente);
          });
          // TODO: Ver de evitar la eliminacion, quizas dejando ciertos ids fijos
          if (registros.length > 100) {
            registros.map(async (registro) => {
              if (registro.usuario === usuarioId)
                await db.deleteValue('recientes', registro.id);
            });
          }
          this.state.actualizacionEstadisticas = false;
        });
      });
    } catch (ex) {
      this.state.actualizacionRecientes = false;
    }
  }

  //
  // La creacion de Usuario requiere obligatoriamente de conectividad por cuestiones practicas
  //
  async actualizarUsuarios() {
    try {
      //Obtener usuarios del indexDB
      IndexedDbService.create().then((db) => {
        db.getAllValues('usuarios').then(async (usuarios: IUsuario[]) => {
          usuarios.map(async (usuario) => {
            //Chequeo de usuario actualizado en la api
            ObtenerUsuarioInfo(usuario.id).then(
              async (usuarioApi: IUsuario) => {
                // Actualizo usuario en el IndexedDb
                console.log(
                  'FECHA ULTIMA ACTUALIZACION EN API: ' +
                    usuarioApi.ultimaActualizacion +
                    ' - FECHA ULTIMA ACTUALIZACION EN INDEXEDDB: ' +
                    usuario.ultimaActualizacion
                );
                if (
                  usuario.ultimaActualizacion < usuarioApi.ultimaActualizacion
                ) {
                  console.log(
                    'ACTUALIZO USUARIO EN INDEXEDDB POR: ',
                    usuarioApi
                  );
                  db.putOrPatchValue('usuarios', usuarioApi);
                }
                // Actualizo usuario en la api
                if (
                  usuarioApi.ultimaActualizacion < usuario.ultimaActualizacion
                ) {
                  console.log('ACTUALIZO USUARIO EN API POR: ', usuario);
                  await ActualizarUsuario(usuario);
                }
              }
            );
          });
          this.state.actualizacionUsuarios = false;
        });
      });
    } catch (ex) {
      this.state.actualizacionUsuarios = false;
    }
  }

  async actualizarPictogramas() {
    try {
      let usuario = await getUsuarioLogueado();
      let usuarioId = usuario !== undefined ? usuario.id : 0;
      ObtenerInformacionPictogramas().then((pictogramas) => {
        let pictogramasFiltrados = pictogramas.filter(
          (p: IPictogram) => p.idUsuario === usuarioId
        );

        IndexedDbService.create().then((db) => {
          db.getAllValues('pictogramasPropios').then(
            async (pictogramasLocales: IPictogram[]) => {
              db.getAllValues('imagenesPropias').then(
                async (imagenesLocales: IPictogram[]) => {
                  // Carga de pictogramas propios de la api que no esten en el indexDb
                  pictogramasFiltrados.map((pictograma) => {
                    if (
                      !pictogramasLocales.some(
                        (p) =>
                          p.identificador === pictograma.identificador &&
                          !p.pendienteCreacion
                      )
                    ) {
                      axios
                        .get(
                          `${apiPictogramas}/pictogramas/${pictograma.id}/obtener/base64`
                        )
                        .then(async (response) => {
                          pictograma.imagen = response.data;
                          db.putOrPatchValue('pictogramasPropios', pictograma);
                          // let pictogramaImagen = {
                          //   identificador: pictograma.identificador,
                          //   imagen: response.data,
                          // } as IPictogramaPropioImagen;
                          // await db.putOrPatchValue(
                          //   'pictogramasPropios',
                          //   pictogramaImagen
                          // );
                        });
                    }
                  });

                  pictogramasLocales.map(async (pictograma) => {
                    if (pictograma.pendienteCreacion) {
                      SubirInformacionPictogramaPropio(pictograma).then(
                        async (resp) => {
                          pictograma.pendienteCreacion = false;
                          db.putOrPatchValue('pictogramasPropios', pictograma);
                        }
                      );
                    }
                    // Eliminacion de pizarra en la api
                    if (pictograma.pendienteEliminacion) {
                      EliminarPictogramaPropio(pictograma.identificador).then(
                        () => {
                          db.deleteValueWithIdentificador(
                            'pictogramasPropios',
                            pictograma.identificador
                          );
                          db.deleteValueWithIdentificador(
                            'imagenesPropias',
                            pictograma.identificador
                          );
                        }
                      );
                    }

                    // ELIMINAR LOCAL SI NO TIENE PENDIENTE DE CREACION NI PENDIENTE DE ELIMINACION Y NO EXISTE EN LA DB
                    // Pictogramas API: pictogramas
                    // Pictogramas locales: pictogramasLocales
                    console.log(
                      'PICTOGRAMAS PROPIOS EN LA API: ',
                      pictogramasFiltrados
                    );
                    console.log(
                      'PICTOGRAMAS PROPIOS LOCALES: ',
                      pictogramasLocales
                    );
                    if (
                      (pictograma.pendienteCreacion === false ||
                        pictograma.pendienteCreacion === undefined ||
                        pictograma.pendienteCreacion === null) &&
                      (pictograma.pendienteEliminacion === false ||
                        pictograma.pendienteEliminacion === undefined ||
                        pictograma.pendienteEliminacion === null) &&
                      !pictogramas.some(
                        (p) => p.identificador === pictograma.identificador
                      )
                    ) {
                      db.deleteValueWithIdentificador(
                        'pictogramasPropios',
                        pictograma.identificador
                      );
                      db.deleteValueWithIdentificador(
                        'imagenesPropias',
                        pictograma.identificador
                      );
                    }
                  });
                }
              );
            }
          );
          this.state.actualizacionPictogramas = false;
        });
      });
    } catch (ex) {
      this.state.actualizacionPictogramas = false;
      console.log(ex);
    }
  }

  async actualizarPizarras() {
    try {
      let usuario = await getUsuarioLogueado();
      let usuarioId = usuario !== undefined ? usuario.id : 0;
      ObtenerPizarras(usuarioId !== undefined ? usuarioId : 0).then(
        (pizarrasApi: IPizarra[]) => {
          IndexedDbService.create().then(async (db) => {
            await db
              .getAllValues('pizarras')
              .then(async (pizarras: IPizarra[]) => {
                // Carga de pizarras de la api que no esten en el indexDb
                pizarrasApi.map((pizarra) => {
                  if (
                    !pizarras.some(
                      (p) => p.id === pizarra.id && !p.pendienteCreacion
                    )
                  ) {
                    db.putOrPatchValue('pizarras', pizarra);
                  }
                });

                console.log('Pizarras api: ', pizarrasApi);
                console.log('Pizarras locales: ', pizarras);
                pizarras.map(async (pizarra) => {
                  // Creacion de pizarra en la api
                  if (pizarra.pendienteCreacion) {
                    await GuardarPizarra(pizarra);
                    pizarra.pendienteCreacion = false;
                    db.putOrPatchValue('pizarras', pizarra);
                  }

                  //TODO: Verificar funcionamiento de actualizacion
                  // Actualizacion de pizarra
                  if (
                    pizarrasApi.some(
                      (p) =>
                        p.id === pizarra.id &&
                        p.ultimaActualizacion > pizarra.ultimaActualizacion
                    )
                  ) {
                    // Debo actualizar la pizarra en el IndexDb
                    console.log('Se actualiza pizarra en indexDb');
                    let p = pizarrasApi.find((p) => p.id === pizarra.id);
                    console.log('PIZARRA API: ', pizarra);
                    console.log('PIZARRA INDEXEDDB: ', p);
                    pizarra = p ? p : pizarra;
                    db.putOrPatchValue('pizarras', p);
                  } else {
                    if (
                      pizarrasApi.some(
                        (p) =>
                          p.id === pizarra.id &&
                          p.ultimaActualizacion < pizarra.ultimaActualizacion
                      )
                    ) {
                      // Debo actualizar la pizarra en la api
                      console.log('Se actualiza pizarra en la api');
                      await ActualizarPizarra(pizarra);
                    }
                  }

                  // Eliminacion de pizarra en la api
                  if (pizarra.pendienteEliminacion) {
                    EliminarPizarra(pizarra).then(() => {
                      db.deleteValue('pizarras', pizarra.id);
                    });
                  }
                });
              });
              this.state.actualizacionPizarras = false;
          });
        }
      );
    } catch (ex) {
      this.state.actualizacionPizarras = false;
      console.log(ex);
    }
  }

  async actualizarFavoritos() {
    try {
      let usuario = await getUsuarioLogueado();
      let usuarioId = usuario !== undefined ? usuario.id : 0;
      ObtenerFavoritosDeUsuario(usuarioId !== undefined ? usuarioId : 0).then(
        (favoritosApi: IFavoritoPorUsuarioApi[]) => {
          IndexedDbService.create().then((db) => {
            db.getAllValues('favoritosPorUsuario').then(
              async (favoritos: IFavoritoPorUsuario[]) => {
                // Carga de favoritos de la api que no esten en el indexDb
                favoritosApi.map((favorito) => {
                  if (
                    !favoritos.some(
                      (f) => f.id === favorito.id && !f.pendienteAgregar
                    )
                  ) {
                    const favCompleto: IFavoritoPorUsuario = {
                      id: favorito.id,
                      idUsuario: favorito.idUsuario,
                      idPictograma: favorito.idPictograma,
                      pendienteAgregar: false,
                      pendienteEliminar: false,
                    };
                    db.putOrPatchValue('favoritosPorUsuario', favCompleto);
                  }
                });

                favoritos.map(async (favorito) => {
                  // Creacion del favorito en la api
                  if (favorito.pendienteAgregar) {
                    await GuardarPictogramaFavorito(
                      favorito.idPictograma,
                      usuarioId !== undefined ? usuarioId : 0
                    );
                    favorito.pendienteAgregar = false;
                    db.putOrPatchValue('favoritosPorUsuario', favorito);
                  }

                  //TODO: Verificar funcionamiento

                  // Eliminacion de favorito en la api
                  if (favorito.pendienteEliminar) {
                    EliminarPictogramaFavorito(
                      favorito.idPictograma,
                      usuarioId !== undefined ? usuarioId : 0
                    ).then(() => {
                      // let idFavorito = usuarioId.toString() + "_" + favorito.idPictograma.toString();
                      db.deleteValue('favoritosPorUsuario', favorito.id);
                    });
                  }
                });
              }
            );
            this.state.actualizacionFavoritos = false;
          });
        }
      );
    } catch (ex) {
      this.state.actualizacionFavoritos = false;
      console.log(ex);
    }
  }

  async actualizarCategoriasPorUsuarios() {
    try {
      let usuario = await getUsuarioLogueado();
      let usuarioId = usuario !== undefined ? usuario.id : 0;
      ObtenerCategoriasPorUsuario(usuarioId !== undefined ? usuarioId : 0).then(
        (categoriasDeUsuarioApi: ICategoriaPorUsuarioApi[]) => {
          IndexedDbService.create().then((db) => {
            db.getAllValues('categoriasPorUsuario').then(
              async (categoriasDeUsuario: ICategoriaPorUsuario[]) => {
                console.log('CATEGORIAS DE USUARIO: ', categoriasDeUsuarioApi);
                // Carga de categoriaPorUsuario de la api que no esten en el indexDb
                categoriasDeUsuarioApi.map(async (categoriaDeUsuario) => {
                  if (
                    !categoriasDeUsuario.some(
                      (cxu) =>
                        cxu.id === categoriaDeUsuario.id &&
                        !cxu.pendienteAgregar
                    )
                  ) {
                    const cxuCompleto: ICategoriaPorUsuario = {
                      id: categoriaDeUsuario.id,
                      idUsuario: categoriaDeUsuario.usuarioId,
                      idCategoria: categoriaDeUsuario.categoriaId,
                      pendienteAgregar: false,
                      pendienteEliminar: false,
                    };
                    await db.putOrPatchValue(
                      'categoriasPorUsuario',
                      cxuCompleto
                    );
                  }
                });

                categoriasDeUsuario.map(async (categoriaDeUsuario) => {
                  // Eliminacion de categoriaPorUsuario en la api
                  if (categoriaDeUsuario.pendienteEliminar) {
                    await EliminarCategoriasPorUsuario(
                      usuarioId !== undefined ? usuarioId : 0,
                      categoriaDeUsuario.idCategoria
                    );
                    await db.deleteValue(
                      'categoriasPorUsuario',
                      categoriaDeUsuario.id
                    );
                  }

                  // Creacion del categoriaPorUsuario en la api
                  if (categoriaDeUsuario.pendienteAgregar) {
                    await InsertarCategoriasPorUsuario(
                      usuarioId !== undefined ? usuarioId : 0,
                      categoriaDeUsuario.idCategoria
                    );
                    categoriaDeUsuario.pendienteAgregar = false;
                    await db.putOrPatchValue(
                      'categoriasPorUsuario',
                      categoriaDeUsuario
                    );
                  }

                  //TODO: Verificar funcionamiento
                });
              }
            );
            this.state.actualizacionCategoriasPorUsuario = false;
          });
        }
      );
    } catch (ex) {
      this.state.actualizacionCategoriasPorUsuario = false;
      console.log(ex);
    }
  }
}
