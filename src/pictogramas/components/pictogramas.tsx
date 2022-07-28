import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { LoadPictogramsFromArasaac } from '../services/arasaac-service';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IPictogram } from '../models/pictogram';
import Pictogram from './pictogram';
import { useLocation, useNavigate } from 'react-router-dom';
import Categorias from './categorias';
import Seleccion from './seleccion';
import { UpdateService } from '../../services/update-service';
import ResponsiveAppBar from '../../commons/appBar';
import FormDialog from './crearPictograma';
import { ICategoria } from '../models/categoria';
import CategoriaSeleccionada from './categoriaSeleccionada';
import PictogramasPorCategoria from './pictogramasPorCategoria';
const db = new IndexedDbService();

export default function Pictogramas(props: any) {
  let navigate = useNavigate();
  let location = useLocation();
  const [imageUrl, setImageUrl] = useState('');
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [pictosIds, setPictosIds] = useState([] as string[]);
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  // Usando otra lista al menos renderiza uno
  const [pictogramasSeleccionados, setPictogramasSeleccionados] = useState(
    [] as IPictogram[]
  );
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    null as ICategoria | null
  );

  const UpdatePictogramas = (pics: IPictogram[]) => {
    setPictogramas(pics);
    setPictogramasSeleccionados(pics);
    console.log('PICTOGRAMAS:', pictogramasSeleccionados);
  };

  return (
    <div>
      <ResponsiveAppBar />
      <br />
      <Seleccion        
        pictogramas={pictogramasSeleccionados}
        setPictogramas={UpdatePictogramas}
      />
      <hr />
      <Button
        variant="contained"
        onClick={() =>
          LoadPictogramsFromArasaac(setPictosIds, setDownloadPercentage)
        }
      >
        Descargar todo Arasaac
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          let updateService = new UpdateService();
        }}
      >
        Descargar Pictogramas Nuestros
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
      />
      <br></br>
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
      <FormDialog />
      {categoriaSeleccionada && (
        <div>
          <CategoriaSeleccionada
            categoriaSeleccionada={categoriaSeleccionada}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
          <PictogramasPorCategoria
            categoria={categoriaSeleccionada.id}
            setPictogramas={UpdatePictogramas}
            pictogramas={pictogramas}
          ></PictogramasPorCategoria>
        </div>
      )}

      {/* Si paso setPictogramas tampoco me actualiza */}
      {/* <Categorias setPictogramas={setPictogramas} pictogramas={pictogramas}/> */}
      <br />
      <Categorias
        setPictogramas={UpdatePictogramas}
        pictogramas={pictogramas}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />
    </div>
  );
}
async function selectPictogramIdChanged(value: string, setImageUrl: any) {
  let arr = value.split('#');
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
