import { IDBPDatabase, openDB } from "idb";
import { apply } from "json-merge-patch";
import { IUsuario } from "../login/model/usuario";
import { ICategoria } from "../pictogramas/models/categoria";
import { ICategoriaPorUsuario } from "../pictogramas/models/categoriaPorUsuario";
import { IFavoritoPorUsuario } from "../pictogramas/models/favoritoPorUsuario";
import { IPictogram } from "../pictogramas/models/pictogram";
import { getUsuarioLogueado, usuarioLogueado } from "./usuarios-services";

export class IndexedDbService {
  private database: string;
  private db: any;

  constructor() {
    this.database = "pictogramas_db";
    this.initializeSchema();
  }

  async initialize() {
    await this.initializeSchema();
  }

  static async create() {
    const o = new IndexedDbService();
    await o.initialize();
    return o;
  }

  public async searchPictogramsByTag(tag: string): Promise<IPictogram[]> {
    let lowerCaseTag = tag.toLowerCase();

    let transaction = this.db.transaction("pictograms", "readonly");
    let objectStore = transaction.objectStore("pictograms");

    var index = objectStore.index("tags-index");

    return await index.getAll(lowerCaseTag);
  }

  public async searchFavoritoByUser(
    idUsuario: number | undefined
  ): Promise<IFavoritoPorUsuario[]> {
    let transaction = this.db.transaction("favoritosPorUsuario", "readonly");
    let objectStore = transaction.objectStore("favoritosPorUsuario");

    var index = objectStore.index("favoritosPorUsuario-index");

    return await index.getAll(idUsuario);
  }

  public async searchCategoriasPorUsuarioByUser(
    idUsuario: number | undefined
  ): Promise<ICategoriaPorUsuario[]> {
    let transaction = this.db.transaction("categoriasPorUsuario", "readonly");
    let objectStore = transaction.objectStore("categoriasPorUsuario");

    var index = objectStore.index("categoriasPorUsuario-index");

    return await index.getAll(idUsuario);
  }

  public async initializeSchema() {
    try {
      this.db = await openDB(this.database, 5, {
        upgrade(
          db: IDBPDatabase,
          oldVersion: number,
          newVersion: number,
          transaction
        ) {
          let objectStore;
          if (!db.objectStoreNames.contains("usuarios")) {
            objectStore = db.createObjectStore("usuarios", {
              autoIncrement: false,
              keyPath: "id",
            });
          }

          // Esta bueno separar por categorias o me conviene reutlizar pictograms?
          if (!db.objectStoreNames.contains("categorias")) {
            objectStore = db.createObjectStore("categorias", {
              autoIncrement: false,
              keyPath: "id",
            });
          }

          if (!db.objectStoreNames.contains("recientes")) {
            objectStore = db.createObjectStore("recientes", {
              autoIncrement: false,
              keyPath: "id",
            });
          }

          objectStore.createIndex("categorias-index", "categorias", {
            unique: false,
            multiEntry: true,
          });

          if (!db.objectStoreNames.contains("imagenes")) {
            objectStore = db.createObjectStore("imagenes", {
              autoIncrement: false,
              keyPath: "id",
            });
          }

          if (!db.objectStoreNames.contains("imagenesPropias")) {
            objectStore = db.createObjectStore("imagenesPropias", {
              autoIncrement: false,
              keyPath: "identificador",
            });
          }

          if (!db.objectStoreNames.contains("pizarras")) {
            objectStore = db.createObjectStore("pizarras", {
              autoIncrement: false,
              keyPath: "id",
            });
          }

          if (!db.objectStoreNames.contains("pictograms")) {
            objectStore = db.createObjectStore("pictograms", {
              autoIncrement: false,
              keyPath: "id",
            });
          } else {
            objectStore = transaction.objectStore("pictograms");
          }

          if (!db.objectStoreNames.contains("pictogramasPropios")) {
            objectStore = db.createObjectStore("pictogramasPropios", {
              autoIncrement: false,
              keyPath: "identificador",
            });
          } else {
            objectStore = transaction.objectStore("pictogramasPropios");
          }

          if (!db.objectStoreNames.contains("favoritosPorUsuario")) {
            objectStore = db.createObjectStore("favoritosPorUsuario", {
              autoIncrement: false,
              keyPath: "id",
            });
            objectStore.createIndex("favoritosPorUsuario-index", "idUsuario", {
              unique: false,
              multiEntry: false,
            });
          } else {
            objectStore = transaction.objectStore("favoritosPorUsuario");
          }

          if (!db.objectStoreNames.contains("categoriasPorUsuario")) {
            objectStore = db.createObjectStore("categoriasPorUsuario", {
              autoIncrement: false,
              keyPath: "id",
            });
            objectStore.createIndex("categoriasPorUsuario-index", "idUsuario", {
              unique: false,
              multiEntry: false,
            });
          } else {
            objectStore = transaction.objectStore("categoriasPorUsuario");
          }

          if (!db.objectStoreNames.contains("historicoUsoPictogramas")) {
            objectStore = db.createObjectStore("historicoUsoPictogramas", {
              //TODO: Se podria sacar el autoincrement y generar un id que tenga por ejemplo usuario_date para poder registrar y luego usar en estadisticas
              autoIncrement: false,
              keyPath: "id",
            });
          }
        },
      });
      console.log("database opened");
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async getPictogram(id: number): Promise<IPictogram> {
    return this.getValue("pictograms", id) as Promise<IPictogram>;
  }

  public async getValue(tableName: string, id: number | string) {
    try {
      const tx = this.db.transaction(tableName, "readonly");
      const store = tx.objectStore(tableName);
      const result = await store.get(id);
      //console.log("Get Data ", JSON.stringify(result));
      return result;
    } catch (e) {
      return null;
    }
  }

  public async getValueByIdentificador(
    tableName: string,
    identificador: string
  ) {
    try {
      const tx = this.db.transaction(tableName, "readonly");
      const store = tx.objectStore(tableName);
      const result = await store.get(identificador);
      //console.log("Get Data ", JSON.stringify(result));
      return result;
    } catch (e) {
      return null;
    }
  }

  public async getAllValues(tableName: string): Promise<any[]> {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    return result;
  }

  public async getPictogramasPorIndice(valor: ICategoria) {
    const tx = this.db.transaction("pictograms", "readonly");
    let objectStore = tx.objectStore("pictograms");
    const index = objectStore.index("categorias-index");
    const result = await index.getAll(valor.nombre);
    return result;
  }

  public async putOrPatchValue(tableName: string, value: any) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);

    try{
    let source = await store.get(value.id);
    let newValue = value;
    if (source) newValue = apply(source, value);

    const result = await store.put(newValue);
    console.log("Put Data ", JSON.stringify(result));
    return result;
    }
    catch(ex){
      console.log("Error en put or patch value: ", ex)
      return null
    }
  }

  public async putOrPatchValueWithoutId(tableName: string, value: any) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);

    let source = await store.get(value.identificador);
    let newValue = value;
    if (source) newValue = apply(source, value);

    const result = await store.put(newValue);
    return result;
  }

  public async putBulkValue(tableName: string, values: object[]) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    for (const value of values) {
      const result = await store.put(value);
      console.log("Put Bulk Data ", JSON.stringify(result));
    }
    return this.getAllValues(tableName);
  }

  public async deleteValue(tableName: string, id: number | string) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      console.log("Id not found", id);
      return result;
    }
    await store.delete(id);
    console.log("Deleted Data", id);
    return id;
  }

  public async deleteValueWithIdentificador(tableName: string, id: string) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      console.log("Id not found", id);
      return result;
    }
    await store.delete(id);
    console.log("Deleted Data", id);
    return id;
  }

  public async countValues(tableName: string) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    const total = result.length;
    console.log("Count all values: ", total);
    return total;
  }

  public async countPictogramasLocales(userid: number | null) {
    // Obtencion pictogramas de arasaac
    const tx = this.db.transaction("pictograms", "readonly");
    const store = tx.objectStore("pictograms");
    const result = await store.getAll();
    let total: number;
    let pictogramasFiltrados = result;

    if (userid !== null)
      pictogramasFiltrados = result.filter(
        (p: IPictogram) =>
          p.idUsuario === null || p.idUsuario === userid || p.idArasaac !== null
      );
    else
      pictogramasFiltrados = result.filter(
        (p: IPictogram) => p.idUsuario === null || p.idArasaac !== null
      );

    total = pictogramasFiltrados.length;

    return total;
  }

  public async countPictogramasDeUsuarioLocales(userid: number | null) {
    // Obtencion pictogramas propios
    const tx = this.db.transaction("pictogramasPropios", "readonly");
    const store = tx.objectStore("pictogramasPropios");
    const result = await store.getAll();
    let total: number;
    let pictogramasFiltrados = result;

    if (userid !== null)
      pictogramasFiltrados = result.filter(
        (p: IPictogram) =>
          p.idUsuario === null || p.idUsuario === userid || p.idArasaac !== null
      );
    else
      pictogramasFiltrados = result.filter(
        (p: IPictogram) => p.idUsuario === null || p.idArasaac !== null
      );

    total = pictogramasFiltrados.length;

    return total;
  }
}
