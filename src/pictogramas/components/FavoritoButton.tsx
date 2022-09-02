import { IconButton } from '@mui/material'
import React from 'react'
import { FavoriteBorder } from '@mui/icons-material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { getUsuarioLogueado, usuarioLogueado } from '../../services/usuarios-services';

const [fav, setFav] = React.useState(false);

interface IFavoritoPorUsuario {
    idUsuario: number,
    idPictograma: number
  }

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

const FavoritoButton = () => {
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
