import { IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FavoriteBorder } from '@mui/icons-material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { getUsuarioLogueado, usuarioLogueado } from '../../services/usuarios-services';
import { EliminarPictogramaFavorito, GuardarPictogramaFavorito } from '../services/pictogramas-services';


const FavoritoButton = () => {
  const [fav, setFav] = useState(false);



  async function handleFavorito(idPictograma: number) { //TODO Completar
    setFav(!fav);
    let userLogueado = await getUsuarioLogueado();
    if (userLogueado !== undefined){
      if (fav) {
        await GuardarPictogramaFavorito(idPictograma);
        //agregar a indexedDb y llamar a la api para que guarden
      } else {
        await EliminarPictogramaFavorito(idPictograma);
        //agregar a indexedDb y llamar a la api para que eliminen
      }
    }
    
  }

  return (
    <div>
      {fav &&
        <IconButton onClick={() => { setFav(!fav) }} aria-label="delete" color="error">
          <FavoriteIcon />
        </IconButton>
      }
      {!fav &&
        <IconButton onClick={() => { setFav(!fav) }} aria-label="delete" color="error">
          <FavoriteBorder />
        </IconButton>
      }
    </div>
  )
}

export default FavoritoButton
