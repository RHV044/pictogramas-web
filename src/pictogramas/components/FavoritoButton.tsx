import { IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FavoriteBorder, PropaneSharp } from '@mui/icons-material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { getUsuarioLogueado, usuarioLogueado } from '../../services/usuarios-services';
import { EliminarPictogramaFavorito, GuardarPictogramaFavorito } from '../services/pictogramas-services';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IFavoritoPorUsuario } from '../models/favoritoPorUsuario';

// const uid = () => {
//   let timmy = Date.now().toString(36).toLocaleUpperCase();
//   let randy = Math.random() * Number.MAX_SAFE_INTEGER;
//   let randyAux = randy.toString(36).slice(0, 12).padStart(12, '0').toLocaleUpperCase();
//   return ''.concat(timmy, '-', randyAux);
// };

const generateId = (idUsuario: number, idPictograma: number) => {
  // return idUsuario.toString() + "_" + idPictograma.toString();
  return parseInt(Date.now().toString().substring(5,13));
}



const FavoritoButton = (props: any) => {
  let isFav=false
  const [fav, setFav] = useState(isFav);
  const [db, setDb] = useState(IndexedDbService.create());

  useEffect(() => {
    const setIsFav = async () => {
      isFav = (await props.favoritos).some(r => r.idPictograma === props.pictograma.id)
      setFav(isFav)
    }
    setIsFav()
  }, []);

    async function handleFavorito() { 
      setFav(!fav);
    let userLogueado = await getUsuarioLogueado();
    
    if (userLogueado !== undefined){
      
      // TODO: Replantear manejo ya que usuario puede no tener id
      let newId = generateId((userLogueado.id === undefined || userLogueado.id === null) ? 0 : userLogueado.id, props.pictograma.id);
      
      if (!fav) {        
                    
        console.log(newId);        
        
        const favPorUser: IFavoritoPorUsuario = {
          id: newId,
          idUsuario: (userLogueado.id === undefined || userLogueado.id === null) ? 0 : userLogueado.id,
          idPictograma: props.pictograma.id,
          pendienteAgregar: false,
          pendienteEliminar: false
        };
        
        if(favPorUser){
          
          await GuardarPictogramaFavorito(props.pictograma.id); //llamado a la api --conviene enviarlo por body para mantener el id
          await (await db).putOrPatchValue('favoritosPorUsuario', favPorUser); //guardar en indexedDB
        }
        else{
          console.log('ingresaste al else');
        }     

      } else {        
        await EliminarPictogramaFavorito(props.pictograma.id); //llamado a la api
        //TODO corregir delete en la indexedDb porque busca en la columna id por el id del pictograma y no esta bien        
        let favoritos = (await db).searchFavoritoByUser((userLogueado && userLogueado.id) ? userLogueado.id : 0);
        let favorito = (await favoritos).find(f => f.idPictograma === props.pictograma.id);
        if (favorito){
          (await db).deleteValue('favoritosPorUsuario', (await favorito).id); //delete en la indexedDb
        } else {
          console.log(`No se pudo eliminar el pictograma ${props.pictograma.id} de favoritos.`)
        }
        
      }
    }    
  }

  return (
    <div>
      {fav && //TODO: falta asociar el fav con el valor de verdad para que cargue bien
        <IconButton 
        onClick={() => { 
          handleFavorito();
         }} 
         aria-label="delete" color="error">
          <FavoriteIcon />
        </IconButton>
      }
      {!fav &&
        <IconButton 
        onClick={() => { 
        handleFavorito(); 
        }} 
        aria-label="delete" color="error">
          <FavoriteBorder />
        </IconButton>
      }
    </div>
  )
}

export default FavoritoButton
