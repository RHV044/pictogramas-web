import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { LoadPictogramsFromArasaac } from "../services/arasaac-service";
import { IndexedDbService } from "../../services/indexeddb-service";
import { IPictogram } from "../models/pictogram";
import Pictogram from "./pictogram";
import { useLocation, useNavigate } from "react-router-dom";
import Categorias from "./categorias";
import Seleccion from "./seleccion";
const db = new IndexedDbService();

export default function Pictogramas(props: any) {
  let navigate = useNavigate();
  let location = useLocation();
  const [imageUrl, setImageUrl] = useState("");
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [pictosIds, setPictosIds] = useState([] as string[]);
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);

  return (
    <div>
      <Seleccion setPictogramas={setPictogramas} pictogramas={pictogramas} /> 
      <hr />
      <Button
        variant="contained"
        onClick={() =>
          LoadPictogramsFromArasaac(setPictosIds, setDownloadPercentage)
        }
      >
        Descargar todo Arasaac
      </Button>
      <CircularProgress variant="determinate" value={downloadPercentage} />
      <br></br>
      <TextField
        id="input-tag-filter"
        label="Filtrar pictogramas por etiqueta o palabras clave"
        variant="standard"
        onChange={(event) => {
          if (event?.target?.value)
            inputTagFilterChanged(event.target.value, setPictosIds);
        }}
      /><br></br>
      <Autocomplete
        id="select-pictogramid"
        options={pictosIds}
        getOptionLabel={(option) => option}
        sx={{ width: 300 }}
        onChange={(event, value) => {
          if (value) selectPictogramIdChanged(value, setImageUrl);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Elija el pictograma que desea visualizar"
          />
        )}
      />
      <Pictogram pictoImageUrl={imageUrl} />
      <hr />      
      <Categorias setPictogramas={setPictogramas} pictogramas={pictogramas}/>
      {/* <Button
        variant="contained"
        onClick={() =>{
          navigate('/categorias' + location.search);
        }}
      >
        Ver Categorias
      </Button> */}
    </div>
  );
}
async function selectPictogramIdChanged(value: string, setImageUrl: any) {
  let arr = value.split("#");
  let picto: IPictogram = await db.getPictogram(Number(arr[arr.length - 1]));
  if (picto?.blob) {
    let url = URL.createObjectURL(picto.blob);
    setImageUrl(url);
  } else setImageUrl(undefined);
}
async function inputTagFilterChanged(
  value: string,
  setPictosIds: React.Dispatch<React.SetStateAction<string[]>>
) {
  let searchResult = await db.searchPictogramsByTag(value);
  setPictosIds(searchResult.map((x) => `${x.name}#${x.id}`).sort());
}
