import axios from "axios";
import { IPictogram } from "../models/pictogram";
import { IndexedDbService } from "../services/indexeddb-service";
const db = new IndexedDbService();
const apiArasaac = process.env.URL ?? "https://api.arasaac.org/api";

export async function LoadPictogramsFromArasaac() {
  // Get json data about every pictogram
  axios
    .get(`${apiArasaac}/pictograms/all/es`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then(async (infoResponse) => {
      let allInfoPictograms: any[] = infoResponse.data;
      await downloadImageAndSavePictograms(allInfoPictograms, 3);
    });
}
async function downloadImageAndSavePictograms(
  allInfoPictograms: any[],
  retriesOnFail: number
) {
  if (retriesOnFail < 0) {
    console.log(
      `No retries left. The following Pictograms were not saved: ${allInfoPictograms.map(
        (x) => x._id
      )}`
    );
    return;
  }

  // Chrome doesn't allow more than 6k requests simultaneusly, so we take groups
  const maxParallelRequests = 1000;
  let count = 0;
  let start = 0;
  let end = 1;
  let failedRequests: any[] = [];

  while (count < allInfoPictograms.length) {
    end =
      allInfoPictograms.length - count <= maxParallelRequests
        ? start + (allInfoPictograms.length - count)
        : start + maxParallelRequests;

    let aGroupOfInfoPictograms = allInfoPictograms.slice(start, end);

    count += end - start;
    start = end;

    let groupRequestPromises: Promise<any>[] = aGroupOfInfoPictograms.map(
      async (pictoInfo: any) => {
        // Get the pictogram's image
        return axios
          .get(`${apiArasaac}/pictograms/${pictoInfo._id}`, {
            headers: {
              Accept: "image/png",
            },
          })
          .then(async (imageResponse) => {
            let picto = {
              id: pictoInfo._id,
              blob: new Blob([imageResponse.data]),
              // For us, keywords and tags are the same.
              tags: [
                ...pictoInfo.tags,
                ...pictoInfo.keywords.map((kw: any) => kw.keyword),
              ],
              description: pictoInfo.desc,
              schematic: pictoInfo.schematic,
              sex: pictoInfo.sex,
              violence: pictoInfo.violence,
              aac: pictoInfo.aac,
              aacColor: pictoInfo.aacColor,
              skin: pictoInfo.skin,
              hair: pictoInfo.hair,
            } as IPictogram;

            await db.putOrPatchValue("pictograms", picto);
          })
          .catch((e) => {
            console.log(e);
            failedRequests.push(pictoInfo);
          });
      }
    );

    await Promise.all(groupRequestPromises);
  }

  //Retry
  if (failedRequests.length > 0)
    downloadImageAndSavePictograms(failedRequests, retriesOnFail--);
  else
    console.log(
      `<<<<<<<<<<<<<<<<<<      TODOS LOS PICTOS DESCARGADOS      >>>>>>>>>>>>>>>>>>>>`
    );
}
