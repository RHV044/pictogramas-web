import axios from "axios";
import { IPictogram } from "../models/pictogram";
import { IndexedDbService } from "../services/indexeddb-service";
const db = new IndexedDbService();

export async function downloadPictogramsFromArasaac(pictogramsIds: number[]) {
  pictogramsIds.forEach((id) => downloadPictogramWithInfo(id));
}
export async function downloadPictogramWithInfo(arasaacId: number) {
  const apiArasaac = process.env.URL ?? "https://api.arasaac.org/api";

  // Get the pictogram's image
  axios
    .get(`${apiArasaac}/pictograms/${arasaacId}`, {
      headers: {
        Accept: "image/png",
      },
    })
    .then((imageResponse) => {
      db.putOrPatchValue("pictograms", {
        id: arasaacId,
        blob: new Blob([imageResponse.data]),
      } as IPictogram);
    });

  // Get json data about the pictogram
  axios
    .get(`${apiArasaac}/pictograms/es/${arasaacId}`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then((infoResponse) => {
      let oData = infoResponse.data;
      let picto = {
        id: arasaacId,
        // For us, keywords and tags are the same.
        tags: [...oData.tags, ...oData.keywords.map((kw: any) => kw.keyword)],
        description: oData.desc,
        schematic: oData.schematic,
        sex: oData.sex,
        violence: oData.violence,
        aac: oData.aac,
        aacColor: oData.aacColor,
        skin: oData.skin,
        hair: oData.hair,
      } as IPictogram;
      db.putOrPatchValue("pictograms", picto);
    });
}
