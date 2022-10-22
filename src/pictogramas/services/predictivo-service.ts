import { IndexedDbService } from "../../services/indexeddb-service";
import { IPictogram } from "../models/pictogram";
let bayes = require("bayes");
const db = new IndexedDbService();
const BAYES_CLASSIFIER_DB_ID = 0;

let inMemoryClassifier;
let classifier = async () => {
  if (inMemoryClassifier) return inMemoryClassifier;

  let classifierObject = await (
    await db
  ).getValue("historicoUsoPictogramas", BAYES_CLASSIFIER_DB_ID);

  if (typeof classifierObject?.classifier === "object") {
    inMemoryClassifier = bayes.importFromObject(classifierObject?.classifier);
  } else if (typeof classifierObject?.classifier === "string") {
    (await db).deleteValue("historicoUsoPictogramas", BAYES_CLASSIFIER_DB_ID);
    inMemoryClassifier = bayes.importFromJson(classifierObject?.classifier);
  } else inMemoryClassifier = bayes();

  return inMemoryClassifier;
};

export async function learn(seleccionPictogramas: IPictogram[]) {
  if (seleccionPictogramas.length > 1) {
    let pictogramasPrevios = seleccionPictogramas.slice(
      0,
      seleccionPictogramas.length - 1
    );

    let keywords = getKeywordsText(pictogramasPrevios);

    let nuevoPicto = seleccionPictogramas[seleccionPictogramas.length - 1];
    console.log(
      `Learning: ${keywords} ==> ${nuevoPicto.id ?? nuevoPicto.identificador}`
    );
    let classifierObject = await classifier();
    classifierObject.learn(keywords, nuevoPicto.id ?? nuevoPicto.identificador);

    (await db).putOrPatchValue("historicoUsoPictogramas", {
      id: BAYES_CLASSIFIER_DB_ID,
      classifier: classifierObject.exportToObject(),
    });

    console.log(classifierObject);
  }
}

export async function predict(
  pictogramas: IPictogram[]
): Promise<IPictogram[]> {
  let resultIds: any[] = await (
    await classifier()
  ).categorize(getKeywordsText(pictogramas), 3);

  let pictograms: IPictogram[] = [];

  for (let result of resultIds) {
    let dbPicto = await db.getPictogram(Number(result?.name));
    if (dbPicto) pictograms.push(dbPicto);
  }
  return pictograms;
}

function getKeywordsText(pictograms: IPictogram[]): string {
  return pictograms
    .map((x) => x.keywords.map((k) => k.keyword).join(" "))
    .join(" ");
}
