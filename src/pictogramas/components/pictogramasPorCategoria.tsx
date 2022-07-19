import { Card, CardActionArea, CardContent, CardHeader, CardMedia, Container } from "@mui/material";
import { useEffect, useState } from "react"
import { IPictogram } from "../models/pictogram";
import { ObtenerPictogramasPorCategoria } from "../services/pictogramas-services";

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

const PictogramasPorCategoria = (props: any) => {

  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);

  useEffect(() => {
    ObtenerPictogramasPorCategoria(setPictogramas, props.categoria)
  }, []);

  return (
    <Container>
      {pictogramas.map((pictograma) => {
        return (
          <Container>
            <Card
              sx={{ maxWidth: 345 }}
              style={{ marginTop: '10px' }}
              onClick={() => {
              }}
            >
              <CardActionArea
              onClick={() => {
                let pictogramasSeleccionados = props.pictogramas
                pictogramasSeleccionados.push(pictograma)
                props.setPictogramas(pictogramasSeleccionados)
                console.log('se agrego un pictograma: ', props.pictogramas)
              }}>
                <CardMedia
                  component="img"
                  height="140"
                  //image={apiPictogramas+'/pictogramas/'+pictograma.id+'/obtener'}
                  //image={pictograma.imagen}         
                  src={`data:image/png;base64, ${pictograma.imagen}`}         
                  alt={pictograma.keywords[0].keyword}
                ></CardMedia>
                <CardHeader title={pictograma.keywords[0].keyword}></CardHeader>
                <CardContent></CardContent>
              </CardActionArea>
            </Card>
          </Container>
        );
      })}
    </Container>
  );
}

export default PictogramasPorCategoria