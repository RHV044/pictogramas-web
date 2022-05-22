import { IDBPDatabase, openDB } from "idb";
import { createIDBEntity, DbEntity } from "idb-query";

export interface IPictogram {
  id: number;
  blob: Blob;
  description: string;
  tags: string[];
}

export class IndexedDbService {
  private database: string;
  private db: any;
  private PictogramDbEntity: DbEntity<IPictogram, "id"> | null = null;

  constructor(database: string) {
    this.database = database;
  }

  public async searchPictogramsBy(
    key: string,
    valueContains: string
  ): Promise<IPictogram[]> {
    if (!this.PictogramDbEntity)
      this.PictogramDbEntity = createIDBEntity<IPictogram, "id">(
        this.db, // need to provide database handle
        "pictograms", // store name
        "id" // keyPath
      );

    return this.PictogramDbEntity.query()
      .filter((pic: any) => pic[key].contains(valueContains))
      .all();
  }
  public async createObjectStore(tableNames: string[]) {
    try {
      this.db = await openDB(this.database, 1, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue;
            }
            db.createObjectStore(tableName, {
              autoIncrement: true,
              keyPath: "id",
            });
          }
        },
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async getValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    console.log("Get Data ", JSON.stringify(result));
    return result;
  }

  public async getAllValues(tableName: string): Promise<any[]> {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    console.log("Get All Data", JSON.stringify(result));
    return result;
  }

  public async putValue(tableName: string, value: object) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.put(value);
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

export default IndexedDbService;
