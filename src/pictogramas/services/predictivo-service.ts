import { IndexedDbService } from "../../services/indexeddb-service";
import { IPictogram } from "../models/pictogram";
let bayes = require("bayes");
const db = new IndexedDbService();
let classifier = bayes();

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
    classifier.learn(keywords, nuevoPicto.id ?? nuevoPicto.identificador);
  }
}

export async function predict(pictogramas: IPictogram[]): Promise<IPictogram> {
  let resultId = await classifier.categorize(getKeywordsText(pictogramas));

  let pictogram = db.getPictogram(Number(resultId));

  return pictogram;
}

function getKeywordsText(pictograms: IPictogram[]): string {
  return pictograms
    .map((x) => x.keywords.map((k) => k.keyword).join(" "))
    .join(" ");
}
