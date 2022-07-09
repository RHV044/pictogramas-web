import axios from "axios";
import { IPictogram } from "../models/pictogram";
import { IndexedDbService } from "./indexeddb-service";
const db = new IndexedDbService();
const apiArasaac = process.env.URL_ARASAAC ?? "https://api.arasaac.org/api";

export async function LoadPictogramsFromArasaac(
  setPictosIds: any,
  setDownloadPercentage: any
) {
  // Get json data about every pictogram
  axios
    .get(`${apiArasaac}/pictograms/all/es`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then(async (infoResponse) => {
      let allInfoPictograms: any[] = infoResponse.data;
      await downloadImageAndSavePictograms(
        allInfoPictograms,
        3,
        setDownloadPercentage
      );
      setPictosIds(allInfoPictograms.map((x) => x._id?.toString()));
    });
}
async function downloadImageAndSavePictograms(
  allInfoPictograms: any[],
  retriesOnFail: number,
  setDownloadPercentage: any
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
  let auxCount = 0;
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
      // eslint-disable-next-line no-loop-func
      async (pictoInfo: any) => {
        // Get the pictogram's image
        return axios
          .get(`${apiArasaac}/pictograms/${pictoInfo._id}`, {
            headers: {
              Accept: "image/png",
            },
            responseType: "blob",
          })
          .then(async (imageResponse) => {
            let picto = {
              id: pictoInfo._id,
              blob: imageResponse.data,
              // For us, keywords and tags are the same.
              tags: [
                ...pictoInfo.tags.map((t: string) => t?.toLowerCase()),
                ...pictoInfo.keywords.map((kw: any) =>
                  kw.keyword?.toLowerCase()
                ),
              ],
              name: pictoInfo.keywords[0]?.keyword?.toLowerCase(),
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
            auxCount++;
            setDownloadPercentage((auxCount / allInfoPictograms.length) * 100);
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
  if (failedRequests.length > 0) {
    let retry = retriesOnFail - 1;
    downloadImageAndSavePictograms(
      failedRequests,
      retry,
      setDownloadPercentage
    );
  } else {
    console.log(
      `<<<<<<<<<<<<<<<<<<      TODOS LOS PICTOS DESCARGADOS      >>>>>>>>>>>>>>>>>>>>`
    );
    setDownloadPercentage(100);
  }
}
