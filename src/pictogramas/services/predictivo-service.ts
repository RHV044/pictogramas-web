import { IndexedDbService } from "../../services/indexeddb-service";
import { IPictogram } from "../models/pictogram";
let bayes = require("bayes");
const db = new IndexedDbService();
const BAYES_CLASSIFIER_DB_ID = 0;

let classifier = async () => {
  let classifierObject = await (
    await db
  ).getValue("historicoUsoPictogramas", BAYES_CLASSIFIER_DB_ID);

  let classifierJSON = classifierObject?.classifier;

  return classifierJSON ? bayes.fromJson(classifierJSON) : bayes();
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
      classifier: classifierObject.toJson(),
    });

    console.log(classifierObject);
  }
}

export async function predict(pictogramas: IPictogram[]): Promise<IPictogram> {
  let resultId = (await classifier()).categorize(getKeywordsText(pictogramas));

  let pictogram = db.getPictogram(Number(await resultId));

  return pictogram;
}

function getKeywordsText(pictograms: IPictogram[]): string {
  return pictograms
    .map((x) => x.keywords.map((k) => k.keyword).join(" "))
    .join(" ");
}
