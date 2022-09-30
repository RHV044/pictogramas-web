import { ICategoria } from '../pictogramas/models/categoria';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  EliminarPictogramaFavorito,
  EliminarPictogramaPropio,
  GuardarPictogramaFavorito,
  ObtenerCategorias,
  ObtenerImagenAsBlob,
  ObtenerInformacionPictogramas,
  ObtenerTotalCategorias,
  ObtenerTotalPictogramas,
  ObtenerYGuardarCategorias,
  VerificarConexion,
} from '../pictogramas/services/pictogramas-services';
import { IndexedDbService } from './indexeddb-service';
import axios from 'axios';
import {
  IPictogramaImagen,
  IPictogramaPropioImagen,
} from '../pictogramas/models/pictogramaImagen';
import {
  ActualizarUsuarioPassword,
  CrearUsuario,
  getUsuarioLogueado,
  ObtenerFavoritosDeUsuario,
  ObtenerUsuarioInfo,
  ObtenerUsuarios,
  SubirImagenPropia,
  SubirInformacionPictogramaPropio,
  usuarioLogueado,
} from './usuarios-services';
import { IPizarra } from '../pizarras/models/pizarra';
import {
  ActualizarPizarra,
  EliminarPizarra,
  ObtenerPizarras,
} from '../pizarras/services/pizarras-services';
import { GuardarPizarra } from '../pizarras/services/pizarras-services';
import { IUsuario } from '../login/model/usuario';
import { IFavoritoPorUsuario } from '../pictogramas/models/favoritoPorUsuario';

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? 'http://localhost:5000';

type MyState = {
  categorias: ICategoria[];
};

export class UpdateService {
  state: MyState = {
    categorias: [],
  };

  constructor() {
    console.log('Inicializando UPDATE SERVICE');
    this.initialize();
    this.addEventsListener();
    this.sincronizar();
  }

  async initialize() {
    let db = await IndexedDbService.create();

    let totalCategoriasLocales = await db.countValues('categorias');
    let totalCategorias = await ObtenerTotalCategorias();
    console.log(
      `Total categorias: ${totalCategorias} vs total categorias locales: ${totalCategoriasLocales}`
    );
    if (totalCategoriasLocales !== totalCategorias) {
      await ObtenerYGuardarCategorias(async (cats: ICategoria[]) => {
        cats.forEach((cat) => {
          if (!cats.some((c) => c.categoriaPadre === cat.id))
            cat.esCategoriaFinal = true;
          else cat.esCategoriaFinal = false;
        });
        await db.putBulkValue('categorias', cats);
      });
    }

    let usuario = await getUsuarioLogueado();
    let totalPictogramasLocales = 1;
    if (usuario != null && usuario !== undefined && usuario.id != null)
      totalPictogramasLocales = await db.countPictogramasPorUsuario(usuario.id);
    else totalPictogramasLocales = await db.countPictogramasPorUsuario(null);

    let totalPictogramas = await ObtenerTotalPictogramas();
    console.log(
      `Total pictogramas: ${totalPictogramas} vs total pictogramas locales: ${totalPictogramasLocales}`
    );
    if (totalPictogramasLocales !== totalPictogramas) {
      let informacion = await ObtenerInformacionPictogramas(); // obtiene pictos de arasaac y de usuario
      let informacionPropios = informacion.filter(
        (p) => p.IdUsuario === usuario?.id
      );
      let informacionArasaac = informacion.filter((p) => p.idArasaac > 0);

      db.putBulkValue('pictograms', informacionArasaac);
      db.putBulkValue('pictogramasPropios', informacionPropios);

      let totalImagenesLocales = await db.countValues('imagenes');      
      totalImagenesLocales = totalImagenesLocales + await db.countValues('imagenesPropias');
      if (totalImagenesLocales !== totalPictogramas) {
        // Obtencion imagenes de pictogramas arasaac
        db.getAllValues('pictograms').then(
          async (pictogramas: IPictogram[]) => {
            if (usuario != null && usuario !== undefined && usuario.id != null)
              pictogramas = pictogramas.filter(
                (p) =>
                  p.idUsuario === null ||
                  p.idUsuario === usuario?.id ||
                  p.idArasaac !== null
              );
            else
              pictogramas = pictogramas.filter(
                (p) => p.idUsuario === null || p.idArasaac !== null
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
                        let pictogramaImagen = {
                          id: pictoInfo.id,
                          imagen: response.data,
                        } as IPictogramaImagen;
                        // pictoInfo.imagen = response.data
                        pictoInfo.imagen = '';
                        await db.putOrPatchValue('pictograms', pictoInfo);
                        // console.log('se obtuvo la imagen: ', pictoInfo.imagen)
                        await db.putOrPatchValue('imagenes', pictogramaImagen);
                      });
                  }
                );

              await Promise.all(groupRequestPromises);
            }
          }
        );

        // Obtencion imagenes de pictogramas pictogramas propios
        db.getAllValues('pictogramasPropios').then(
          async (pictogramas: IPictogram[]) => {
            if (usuario != null && usuario !== undefined && usuario.id != null)
              pictogramas = pictogramas.filter(
                (p) =>
                  p.idUsuario === null ||
                  p.idUsuario === usuario?.id ||
                  p.idArasaac !== null
              );
            else
              pictogramas = pictogramas.filter(
                (p) => p.idUsuario === null || p.idArasaac !== null
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
                        let pictogramaImagen = {
                          id: pictoInfo.id,
                          imagen: response.data,
                        } as IPictogramaImagen;
                        // pictoInfo.imagen = response.data
                        pictoInfo.imagen = '';
                        await db.putOrPatchValue(
                          'pictogramasPropios',
                          pictoInfo
                        );
                        // console.log('se obtuvo la imagen: ', pictoInfo.imagen)
                        await db.putOrPatchValue(
                          'imagenesPropias',
                          pictogramaImagen
                        );
                      });
                  }
                );

              await Promise.all(groupRequestPromises);
            }
          }
        );
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
    if (window.navigator.onLine) {
      this.actualizarPizarras();
      this.actualizarUsuarios();
      this.actualizarPictogramas();
      this.actualizarFavoritos();
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
                if (usuarioApi.ultimaActualizacion > usuario.ultimaActualizacion) 
                {
                  db.putOrPatchValue('usuarios', usuarioApi);
                }

                // Actualizo usuario en la api
                if (usuarioApi.ultimaActualizacion < usuario.ultimaActualizacion)
                {
                  await ActualizarUsuarioPassword(usuario);
                }
              }
            );               
          });
        });
      });
    } catch (ex) {}
  }

  async actualizarPictogramas() {
    try {
      let usuarioId =
        usuarioLogueado?.id !== undefined ? usuarioLogueado?.id : 0;
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
                      pictograma.imagen = '';
                      db.putOrPatchValue('pictogramasPropios', pictograma);
                      axios
                        .get(
                          `${apiPictogramas}/pictogramas/${pictograma.id}/obtener/base64`
                        )
                        .then(async (response) => {
                          let pictogramaImagen = {
                            identificador: pictograma.identificador,
                            imagen: response.data,
                          } as IPictogramaPropioImagen;
                          await db.putOrPatchValue(
                            'imagenesPropias',
                            pictogramaImagen
                          );
                        });
                    }
                  });

                  pictogramasLocales.map(async (pictograma) => {
                    if (pictograma.pendienteCreacion) {
                      // TODO: Verificar creacion con asincronismo
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
                  });
                }
              );
            }
          );
        });
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  async actualizarPizarras() {
    try {
      let usuarioId =
        usuarioLogueado?.id !== undefined ? usuarioLogueado?.id : 0;
      ObtenerPizarras(usuarioId).then((pizarrasApi: IPizarra[]) => {
        IndexedDbService.create().then((db) => {
          db.getAllValues('pizarras').then(async (pizarras: IPizarra[]) => {
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

            pizarras.map(async (pizarra) => {
              // Creacion de pizarra en la api
              if (pizarra.pendienteCreacion) {
                await GuardarPizarra(pizarra);
                pizarra.pendienteCreacion = false;
                db.putOrPatchValue('pizarras', pizarra);
              }

              //TODO: Verificar funcionamiento
              // Actualizacion de pizarra
              if (
                pizarras.some(
                  (p) =>
                    p.id === pizarra.id &&
                    p.ultimaActualizacion < pizarra.ultimaActualizacion
                )
              ) {
                // Debo actualizar la pizarra en el IndexDb
                let p = pizarras.find((p) => p.id === pizarra.id);
                pizarra = p ? p : pizarra;
                db.putOrPatchValue('pizarras', pizarra);
              } else {
                if(pizarras.some(
                    (p) =>
                      p.id === pizarra.id &&
                      p.ultimaActualizacion > pizarra.ultimaActualizacion))
                {
                  // Debo actualizar la pizarra en la api
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
        });
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  async actualizarFavoritos(){
    try{
      let usuarioId =
        usuarioLogueado?.id !== undefined ? usuarioLogueado?.id : 0;
        ObtenerFavoritosDeUsuario(usuarioId).then((favoritosApi: IFavoritoPorUsuario[]) => {
        IndexedDbService.create().then((db) => {
          db.getAllValues('favoritosPorUsuario').then(async (favoritos: IFavoritoPorUsuario[]) => {
            // Carga de pizarras de la api que no esten en el indexDb
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
                  pendienteEliminar: false
                };
                db.putOrPatchValue('favoritosPorUsuario', favCompleto);
              }
            });

            favoritos.map(async (favorito) => {
              // Creacion del favorito en la api
              if (favorito.pendienteAgregar) {
                await GuardarPictogramaFavorito(favorito.idPictograma, usuarioId);
                favorito.pendienteAgregar = false;
                db.putOrPatchValue('favoritosPorUsuario', favorito);
              }

              //TODO: Verificar funcionamiento
              
              // Eliminacion de favorito en la api
              if (favorito.pendienteEliminar) {
                EliminarPictogramaFavorito(favorito.idPictograma, usuarioId).then(() => {
                  // let idFavorito = usuarioId.toString() + "_" + favorito.idPictograma.toString();
                  db.deleteValue('favoritosPorUsuario', favorito.id);
                });
              }
            });
          });
        });
      });
    }catch (ex){
        console.log(ex);
    }
  }
}
