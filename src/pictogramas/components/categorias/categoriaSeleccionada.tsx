import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
} from '@mui/material';

export default function CategoriaSeleccionada(props: any) {
  return (
    <div>
      <Card
        sx={{ maxWidth: 245 }}
        style={{ marginTop: '10px' }}
        onClick={() => {}}
      >
        <CardActionArea
          onClick={() => {
            props.setCategoriaSeleccionada(props.categoriaSeleccionada);
          }}
        >
          <CardMedia
            component="img"
            height="140"
            image="https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2017/04/24/5fa3cfbde979b.jpeg"
            alt="MESSI"
          ></CardMedia>
          <CardHeader title={props.categoriaSeleccionada.nombre}></CardHeader>
          <CardContent></CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
