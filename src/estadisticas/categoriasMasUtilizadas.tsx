import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
} from '@mui/material';
import { useEffect, useState } from "react"
import { ICategoria } from "../pictogramas/models/categoria"
import { ObtenerCategoriasPorIds, ObtenerInformacionPictogramas, ObtenerPictogramasConImagenes } from "../pictogramas/services/pictogramas-services"

export default function CategoriasMasUtilizadas(props: any){

  const [categorias, setCategorias] = useState([] as ICategoria[])

  useEffect(() => {
    console.log("categorias: ", props.categorias)
    ObtenerCategoriasPorIds(props.categorias).then(cats => {
      setCategorias(cats)
    })
  }, [])

  return(
    <Container>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
      >
        {categorias.map((categoria) => {
          return (
            <Grid
              key={categoria.id}
              item
              xs={12}
              sm={4}
              md={2}
            >
              <Container
                key={categoria.id}
              >
                <Card
                  sx={{
                    maxWidth: 230,
                    minWidth: 70,
                    maxHeight: 240,
                    minHeight: 50,
                  }}
                  style={{ marginTop: '10px' }}
                  onClick={() => {}}
                >
                  <CardActionArea
                    onClick={() => {
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      width="140"
                      src={
                        categoria.imagen &&
                        categoria.imagen.includes('data:image')
                          ? categoria.imagen
                          : `data:image/png;base64,${categoria.imagen}`
                      }
                      alt={categoria.nombre}
                    ></CardMedia>
                    <CardHeader
                      style={{
                        height: '100%',
                        width: '95%',
                        marginBottom: 1,
                        paddingBottom: 0,
                      }}
                    ></CardHeader>
                    <CardContent
                      style={{
                        marginTop: 1,
                        paddingTop: 0,
                        marginLeft: 4,
                        paddingLeft: 0,
                        fontWeight: 'bold',
                        paddingBottom: 0,
                      }}
                    >
                      {categoria.nombre.toLocaleUpperCase()}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Container>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  )
}