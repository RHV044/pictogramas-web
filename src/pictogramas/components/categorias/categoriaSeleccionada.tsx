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
        sx={{ maxWidth: 100 }}
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
            src={`data:image/png;base64,${props.categoriaSeleccionada.imagen}`}
            alt="MESSI"
          ></CardMedia>
          <CardHeader title={props.categoriaSeleccionada.nombre}></CardHeader>
          <CardContent></CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
