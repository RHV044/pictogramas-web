import React, { useRef, useState } from "react";
import {
  Autocomplete,
  Button,
  CardActionArea,
  CircularProgress,
  TextField,
} from "@mui/material";
import { LoadPictogramsFromArasaac } from "../services/arasaac-service";
import { IndexedDbService } from "../services/indexeddb-service";
import { IPictogram } from "../models/pictogram";
import Pictogram from "./pictogram";
const db = new IndexedDbService();

let myContainerRef: React.MutableRefObject<null>;

export default function Inicio(props: any) {
  const [imageUrl, setImageUrl] = useState("");
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [pictosIds, setPictosIds] = useState([] as string[]);
  return (
    <div>
      <Button
        variant="contained"
        onClick={() =>
          LoadPictogramsFromArasaac(setPictosIds, setDownloadPercentage)
        }
      >
        Descargar todo Arasaac
      </Button>
      <CircularProgress variant="determinate" value={downloadPercentage} />
      <TextField
        id="standard-basic"
        label="Standard"
        variant="standard"
        onChange={(event) => {
          if (event?.target?.value)
            selectPictogramIdChanged(event.target.value, setImageUrl);
        }}
      />
      <Pictogram pictoImageUrl={imageUrl} />
    </div>
  );
}
async function selectPictogramIdChanged(value: string, setImageUrl: any) {
  let picto: IPictogram = await db.getPictogram(Number(value));
  if (picto?.blob) {
    let url = URL.createObjectURL(picto.blob);
    setImageUrl(url);
  } else setImageUrl(undefined);
}
