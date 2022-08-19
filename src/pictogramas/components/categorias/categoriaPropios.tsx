import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
} from '@mui/material';
import { ICategoria } from '../../models/categoria';

export default function CategoriaPropios(props: any) {
  return (
    <Grid
      key={-1}
      item
      xs={12}
      sm={4}
      md={2}
    >
      <Container key={-1}>
        <Card
          sx={{ maxWidth: 245, minWidth: 150 }}
          style={{ marginTop: '10px' }}
          onClick={() => {}}
        >
          <CardActionArea
            onClick={() => {
              if (
                props.categoriaSeleccionada == null ||
                props.categoriaSeleccionada !== -1
              ) {
                let categoria = {id: -1, nombre: "Pictogramas Propios"} as ICategoria
                props.setCategoriaSeleccionada(categoria);
              } else {
                props.setCategoriaSeleccionada(null);
              }
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image="https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2017/04/24/5fa3cfbde979b.jpeg"
              alt="MESSI"
            ></CardMedia>
            <CardHeader title={"Pictogramas Propios"}></CardHeader>
            <CardContent></CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Grid>
  );
}
