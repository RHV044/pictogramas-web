import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { ICategoria } from '../../models/categoria';
import { ObtenerCategorias } from '../../services/pictogramas-services';
import Categoria from './categoria';
import CategoriaPropios from './categoriaPropios';

export default function CategoriasRaices(props: any) {
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    {} as ICategoria | null
  );

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  return (
    <Container>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 10, md: 12 }}>
        {/* TODO: Agregar pictogramas favoritos o recientes si fuera necesario */}
        <CategoriaPropios setCategoriaSeleccionada={props.setCategoriaSeleccionada} categoriaSeleccionada={categoriaSeleccionada}/>
        {/* 
        TODO: Se debe devolver solo las categorias que no tengan categoria padre 
          En caso de que tengan padre, se renderizaran dentro de la categoria seleccionada 
        */}
        {/* TODO: Solo debo mostrar categorias que son raiz */}
        {categorias.map((categoria) => {
          if (categoria.categoriaPadre === null || categoria.categoriaPadre === undefined || categoria.categoriaPadre < 1)
          {
            return (
                <Grid
                  key={categoria.id + '-' + categoria.nombre}
                  item xs={12} sm={4} md={2}
                >
                  <Container key={categoria.id + '-' + categoria.nombre}>
                    <Categoria 
                      setCategoriaSeleccionada={props.setCategoriaSeleccionada} 
                      categoria={categoria}
                      categoriaSeleccionada={categoriaSeleccionada}
                      categorias={categorias}
                    />
                  </Container>
                </Grid>
              );
            }
        })}
      </Grid>
    </Container>
  );
}
