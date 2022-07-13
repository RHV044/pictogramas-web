import { Card, CardActionArea, CardContent, CardHeader, CardMedia, Container } from "@mui/material";
import { useEffect, useState } from "react"
import { IPictogram } from "../models/pictogram";
import { ObtenerPictogramaAsStream, ObtenerPictogramasPorCategoria } from "../services/pictogramas-services";

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
                //EXPANDIR CATEGORIA
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={apiPictogramas+'/pictogramas/'+pictograma.id+'/obtener'}
                  alt={pictograma.keywords[0].keyword}
                ></CardMedia>
                <CardHeader title={pictograma.keywords[0].keyword}></CardHeader>
                <CardContent>{/* Quizas agregar una imagen */}</CardContent>
              </CardActionArea>
            </Card>
          </Container>
        );
      })}
    </Container>
  );
}

export default PictogramasPorCategoria