import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import { FavoriteBorder } from '@mui/icons-material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { getUsuarioLogueado, usuarioLogueado } from '../../services/usuarios-services';

interface IFavoritoPorUsuario {
    idUsuario: number,
    idPictograma: number
  }
const FavoritoButton = () => {
  const [fav, setFav] = useState(false);

  function handleFavorito(idPictograma: number) { //TODO Completar
    if (false) {

    } else {
      const picFav = {
        idUsuario: usuarioLogueado?.id,
        idPictograma: idPictograma
      }
      //agregar a indexedDb y llamar a la api para que guarde

    }
  }

  return (
      <div>
          {fav &&
              <IconButton onClick={() => { setFav(!fav) }} aria-label="delete" color="primary">
                  <FavoriteBorder />
              </IconButton>
          }
          {!fav &&
              <IconButton onClick={() => { setFav(!fav) }} aria-label="delete" color="primary">
                  <FavoriteIcon />
              </IconButton>
          }
      </div>
  )
}

export default FavoritoButton
