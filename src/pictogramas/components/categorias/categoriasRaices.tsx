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
import { useLocation, useNavigate } from 'react-router-dom';
import { getUsuarioLogueado, usuarioLogueado, setUsuarioLogueadoVariable } from '../../../services/usuarios-services';
import { ICategoria } from '../../models/categoria';
import { ObtenerCategorias } from '../../services/pictogramas-services';
import Recientes from '../sugerencias/recientes';
import Categoria from './categoria';
import CategoriaFavoritos from './categoriaFavoritos';
import CategoriaPropios from './categoriaPropios';

export default function CategoriasRaices(props: any) {
  let navigate = useNavigate();
  let location = useLocation();
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    {} as ICategoria | null
  );

  useEffect(() => {
    getUsuarioLogueado().then(usuario => {
      if(usuario === null || usuario === undefined){
        // Redirijo a seleccionar cuenta
        navigate('/cuenta/seleccionar' + location.search);
      }
      else{
        setUsuarioLogueadoVariable(usuario)
      }
    })
    ObtenerCategorias(setCategorias);
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 10, sm: 10, md: 12 }} style={{marginTop: 1, marginLeft: 0, marginRight: 0}}>
        {/* TODO: Agregar pictogramas recientes si fuera necesario */}
        <CategoriaPropios setCategoriaSeleccionada={props.setCategoriaSeleccionada} categoriaSeleccionada={categoriaSeleccionada}/>
        <CategoriaFavoritos setCategoriaSeleccionada={props.setCategoriaSeleccionada} categoriaSeleccionada={categoriaSeleccionada}/>
        {categorias.map((categoria) => {
          if ((categoria.categoriaPadre === null || categoria.categoriaPadre === undefined || categoria.categoriaPadre < 1) && 
              categoria.nivel <= (usuarioLogueado?.nivel !== undefined ? usuarioLogueado?.nivel : 0)) //TODO agregar consideracion para el nivel personalizado.
          {
            return (
                <Grid
                  key={categoria.id + '-' + categoria.nombre}
                  item xs={4} sm={3} md={2}
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
