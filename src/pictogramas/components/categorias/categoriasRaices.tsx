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
import { IUsuario } from '../../../login/model/usuario';
import { IndexedDbService } from '../../../services/indexeddb-service';
import { ICategoria } from '../../models/categoria';
import { ICategoriaPorUsuario } from '../../models/categoriaPorUsuario';
import { ObtenerCategorias } from '../../services/pictogramas-services';
import Recientes from '../sugerencias/recientes';
import Categoria from './categoria';
import CategoriaFavoritos from './categoriaFavoritos';
import CategoriaPropios from './categoriaPropios';

export default function CategoriasRaices(props: any) {

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    {} as ICategoria | null
  );
  

  useEffect(() => {
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 10, sm: 10, md: 12 }} style={{marginTop: 1, marginLeft: 0, marginRight: 0}}>
        {/* TODO: Agregar pictogramas recientes si fuera necesario */}
        <CategoriaPropios setCategoriaSeleccionada={props.setCategoriaSeleccionada} categoriaSeleccionada={categoriaSeleccionada}/>
        <CategoriaFavoritos setCategoriaSeleccionada={props.setCategoriaSeleccionada} categoriaSeleccionada={categoriaSeleccionada}/>
        {props.categorias.map((categoria) => {
          if ((categoria.categoriaPadre === null || categoria.categoriaPadre === undefined || categoria.categoriaPadre < 1) && 
              categoria.nivel <= (props.usuarioLogueado?.nivel !== undefined ? props.usuarioLogueado?.nivel : 0) && (props.usuarioLogueado?.nivel !== 3 || verificarValidezDeCategoria(categoria, props.categorias, props.categoriasPorUsuario, props.usuarioLogueado))) //TODO agregar consideracion para el nivel personalizado.
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
                      categorias={props.categorias}
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

export function verificarValidezDeCategoria(categoria : ICategoria, categorias : ICategoria[], categoriasPorUsuario: ICategoriaPorUsuario[], user: IUsuario | null){
    if(categoria.esCategoriaFinal){
      if(user && categoria.nivel <= user.nivel && (user.nivel !== 3 || categoriasPorUsuario.some(cat => cat.idCategoria === categoria.id))){
        return true;
      } else {      
        return false;
      }      
    } else {
      let categoriasHijas = categorias.filter(cat => cat.categoriaPadre === categoria.id);
      return categoriasHijas.some(c => verificarValidezDeCategoria(c, categorias, categoriasPorUsuario, user));
    }   
}

// export function descendientesAMostrar(categoriaTarget : ICategoria, categorias : ICategoria[],
//   categoriasDeUsuario : ICategoriaPorUsuario[]) : ICategoria[] {

//    let categoriasHijas = categorias.filter(cat => cat.categoriaPadre === categoriaTarget.id);
//    let siguienteFilaCategoriasNoFinales : ICategoria[] = [];

//    categoriasHijas.forEach(cat => {
//     if(!cat.esCategoriaFinal){
//       siguienteFilaCategoriasNoFinales.concat(categorias.filter(categoria => categoria.categoriaPadre === cat.id));
//     }
//     else{ //comprobar si la categoria final esta en categorias por usuario
//       if(!(categoriasDeUsuario.some(cxu => cxu.idCategoria === cat.id))){
//         categoriasHijas = categoriasHijas.filter(c => c.id !== cat.id);
//       }
//     }
//     if (siguienteFilaCategoriasNoFinales != null){
//       categoriasHijas.concat(descendientesAMostrar(cat, siguienteFilaCategoriasNoFinales, categoriasDeUsuario)); //idea: aca llamar recursivamente a la funcion
//    }
//    });   

//    return categoriasHijas; //esto no va a andar jajajaaj
// }
