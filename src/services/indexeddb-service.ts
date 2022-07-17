import { IDBPDatabase, openDB } from "idb";
import { apply } from "json-merge-patch";
import { IPictogram } from "../pictogramas/models/pictogram";

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
  public async initializeSchema() {
    try {
      console.log('inicializa base')
      this.db = await openDB(this.database, 3, {
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

          if (!db.objectStoreNames.contains("pictograms")) {
            objectStore = db.createObjectStore("pictograms", {
              autoIncrement: false,
              keyPath: "id",
            });
          } else {
            objectStore = transaction.objectStore("pictograms");
          }

          objectStore.createIndex("tags-index", "tags", {
            unique: false,
            multiEntry: true,
          });
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
  public async getValue(tableName: string, id: number) {
    try{
      const tx = this.db.transaction(tableName, "readonly");
      const store = tx.objectStore(tableName);
      const result = await store.get(id);
      console.log("Get Data ", JSON.stringify(result));
      return result;      
    }
    catch (e){
      return null
    }
  }

  public async getAllValues(tableName: string): Promise<any[]> {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    console.log("Get All Data", JSON.stringify(result));
    return result;
  }

  public async putOrPatchValue(tableName: string, value: any) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);

    let source = await store.get(value.id);
    let newValue = value;
    if (source) newValue = apply(source, value);

    const result = await store.put(newValue);
    console.log("Put Data ", JSON.stringify(result));
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

  public async deleteValue(tableName: string, id: number) {
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
}
