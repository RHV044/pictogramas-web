import { IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FavoriteBorder } from '@mui/icons-material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { getUsuarioLogueado, usuarioLogueado } from '../../services/usuarios-services';
import { EliminarPictogramaFavorito, GuardarPictogramaFavorito } from '../services/pictogramas-services';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IFavoritoPorUsuario } from '../models/favoritoPorUsuario';


const FavoritoButton = (props: any) => {
  const [fav, setFav] = useState(false);
  const [db, setDb] = useState(IndexedDbService.create());


  async function handleFavorito() { //TODO Completar y pregunta: de dónde va a sacar ese id de pictograma?
    setFav(!fav);
    let userLogueado = await getUsuarioLogueado();
    if (userLogueado !== undefined){
      if (!fav) {        
        const favPorUser: IFavoritoPorUsuario = {
          idUsuario: (userLogueado.id === undefined || userLogueado.id === null) ? 0 : userLogueado.id,
          idPictograma: props.pictograma.id
        };

        await GuardarPictogramaFavorito(props.pictograma.id); //llamado a la api
        await (await db).putOrPatchValue('favoritosPorUsuario', favPorUser); //guardar en indexedDB

      } else {
        await EliminarPictogramaFavorito(props.pictograma.id); //llamado a la api
        (await db).deleteValue('favoritosPorUsuario', props.pictograma.id); //delete en la indexedDb
      }
    }    
  }

  return (
    <div>
      {fav &&
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
