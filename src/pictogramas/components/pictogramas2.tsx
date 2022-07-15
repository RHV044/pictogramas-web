import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Container,
  TextField,
} from '@mui/material';
import { LoadPictogramsFromArasaac } from '../services/arasaac-service';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IPictogram } from '../models/pictogram';
import Pictogram from './pictogram';
import { useLocation, useNavigate } from 'react-router-dom';
import Categorias from './categorias';
import Seleccion from './seleccion';
import { ICategoria } from '../models/categoria';
import { ObtenerCategorias, ObtenerPictogramasPorCategoria } from '../services/pictogramas-services';
const db = new IndexedDbService();

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? 'http://localhost:5000';

export default function Pictogramas2(props: any) {
  let navigate = useNavigate();
  let location = useLocation();
  const [imageUrl, setImageUrl] = useState('');
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [pictosIds, setPictosIds] = useState([] as string[]);
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [pictogramasPorCategoria, setPictogramasPorCategoria] = useState([] as IPictogram[]);
  // Usando otra lista al menos renderiza uno
  const [pictogramasSeleccionados, setPictogramasSeleccionados] = useState(
    [] as IPictogram[]
  );

  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    {} as ICategoria | null
  );

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  return (
    <div>
      <Container>
        {pictogramasSeleccionados.map((pictograma: IPictogram) => {
          return (
            <Container>
              <Card
                sx={{ maxWidth: 345 }}
                style={{ marginTop: '10px' }}
                onClick={() => {
                  let nuevaLista = pictogramasSeleccionados.filter(
                    (p: IPictogram) => p.id != pictograma.id
                  );
                  console.log(
                    'removiendo pictograma, van  a quedar: ',
                    nuevaLista
                  );
                  setPictogramasSeleccionados(nuevaLista);
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      apiPictogramas +
                      '/pictogramas/' +
                      pictograma.id +
                      '/obtener'
                    }
                    alt={pictograma.keywords[0].keyword}
                  ></CardMedia>
                  <CardHeader
                    title={pictograma.keywords[0].keyword}
                  ></CardHeader>
                  <CardContent></CardContent>
                </CardActionArea>
              </Card>
            </Container>
          );
        })}
      </Container>
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

      <Container>
        {categorias.map((categoria) => {
          return (
            <Container key={categoria.nombre}>
              <Card
                key={categoria.nombre}
                sx={{ maxWidth: 345 }}
                style={{ marginTop: '10px' }}
                onClick={() => {}}
              >
                <CardActionArea
                  onClick={() => {
                    console.log('Clickearon una categoria: ', categoria.id);
                    if (
                      categoriaSeleccionada == null ||
                      categoriaSeleccionada !== categoria
                    )
                    {
                      setCategoriaSeleccionada(categoria);
                      ObtenerPictogramasPorCategoria(setPictogramasPorCategoria, categoria.id)
                    }
                    else setCategoriaSeleccionada(null);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2017/04/24/5fa3cfbde979b.jpeg"
                    alt="MESSI"
                  ></CardMedia>
                  <CardHeader title={categoria.nombre}></CardHeader>
                  <CardContent></CardContent>
                </CardActionArea>
              </Card>
              {categoria === categoriaSeleccionada && (
                <Container>
                  {pictogramasPorCategoria.map((pictograma) => {
                    return (
                      <Container>
                        <Card
                          sx={{ maxWidth: 345 }}
                          style={{ marginTop: '10px' }}
                          onClick={() => {}}
                        >
                          <CardActionArea
                            onClick={() => {
                              let pics= pictogramasSeleccionados;
                              pics.push(pictograma);
                              setPictogramasSeleccionados(pics);
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="140"
                              image={
                                apiPictogramas +
                                '/pictogramas/' +
                                pictograma.id +
                                '/obtener'
                              }
                              alt={pictograma.keywords[0].keyword}
                            ></CardMedia>
                            <CardHeader
                              title={pictograma.keywords[0].keyword}
                            ></CardHeader>
                            <CardContent></CardContent>
                          </CardActionArea>
                        </Card>
                      </Container>
                    );
                  })}
                </Container>
              )}
            </Container>
          );
        })}
      </Container>
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
