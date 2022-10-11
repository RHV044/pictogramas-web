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
        sx={{ maxWidth: 230, minWidth:70, maxHeight: 240, minHeight: 50 }}
        style={{ marginTop: '10px', marginLeft: 35 }}
        onClick={() => {}}
      >
        <CardActionArea
          onClick={() => {
            if(props.categoriaActual === props.categoriaSeleccionada)
              props.setCategoriaSeleccionada(null);
            else
              props.setCategoriaSeleccionada(props.categoriaSeleccionada);
          }}
        >
          <CardMedia
            component="img"
            height="160"
            width="140"
            src={props.categoriaSeleccionada.imagen && props.categoriaSeleccionada.imagen.includes('data:image') ? props.categoriaSeleccionada.imagen : `data:image/png;base64,${props.categoriaSeleccionada.imagen}`}
            alt={props.categoriaSeleccionada.nombre}
          ></CardMedia>
          <CardHeader           
            style={{
              height: '100%',
              width: '95%',
              marginBottom: 1,
              paddingBottom: 0
            }} 
            ></CardHeader>
          <CardContent
            style={{
              marginTop: 1,
              paddingTop: 0,
              marginLeft: 4,
              paddingLeft: 0,
              fontWeight: 'bold'
            }}
          >
            {props.categoriaSeleccionada.nombre}
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
