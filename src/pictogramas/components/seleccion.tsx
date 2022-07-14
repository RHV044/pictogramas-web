import { Card, CardActionArea, CardContent, CardHeader, CardMedia } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { IPictogram } from "../models/pictogram";

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

const Seleccion = (props: {pictogramas: IPictogram[], setPictogramas: any}) => {

  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);

  useEffect(() => {
    console.log('pictogramas Actualizados: ', props.pictogramas)
    setPictogramas(props.pictogramas)
  }, [props.pictogramas])

  useEffect(() => {
    console.log('pictogramas Actualizados: ', props.pictogramas)
    setPictogramas(props.pictogramas)
  })

  return(
    <Container>
      {pictogramas.map((pictograma: IPictogram) => {
        return (
          <Container>
            <Card
              sx={{ maxWidth: 345 }}
              style={{ marginTop: '10px' }}
              onClick={() => {
                props.setPictogramas(props.pictogramas.filter((p: IPictogram) => p.id != pictograma.id))
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
                <CardContent></CardContent>
              </CardActionArea>
            </Card>
          </Container>
        )
      })
    }
    </Container>
  )
}

export default Seleccion