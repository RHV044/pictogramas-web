import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox } from '@mui/material';
import Filtros from './filtros';
import { ICategoria } from '../models/categoria';
import { ObtenerCategorias } from '../services/pictogramas-services';
import { useEffect, useState } from 'react';
import { SubirPictograma, usuarioLogueado } from '../../services/usuarios-services';

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState(
    [] as ICategoria[]
  );
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [file, setFile] = useState(null as any)

  const [violento, setViolento] = useState(false)
  const [sexual, setSexual] = useState(false)
  const [esquematico, setEsquematico] = useState(false)
  const [aac, setAac] = useState(false)
  const [aacColor, setAacColor] = useState(false)
  const [skin, setSkin] = useState(false)
  const [hair, setHair] = useState(false)

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCrear = () => {
    let filtros: { [key: string]: boolean } = {};
    filtros.violento = violento
    filtros.sexual = sexual
    filtros.esquematico = esquematico
    filtros.aac = aac
    filtros.aacColor = aacColor
    filtros.skin = skin
    filtros.hair = hair
    SubirPictograma(usuarioLogueado?.id, file, categoriasFiltradas, filtros)
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Crear Pictograma
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Creacion de Pictograma</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccione las propiedades y categorias con las que cumple el
            pictograma para ayudar en la busqueda y filtrado
          </DialogContentText>
          Violento <Checkbox checked={violento} onChange={(e) => setViolento(e.target.checked)} />
          <br />
          Sexual <Checkbox checked={sexual} onChange={(e) => setSexual(e.target.checked)}/>
          <br />
          Esquematico <Checkbox checked={esquematico} onChange={(e) => setEsquematico(e.target.checked)}/>
          <br />
          Aac <Checkbox checked={aac} onChange={(e) => setAac(e.target.checked)}/>
          <br />
          Aac Color <Checkbox checked={aacColor} onChange={(e) => setAacColor(e.target.checked)}/>
          <br />
          Tiene piel <Checkbox checked={skin} onChange={(e) => setSkin(e.target.checked)}/>
          <br />
          Tiene pelo <Checkbox checked={hair} onChange={(e) => setHair(e.target.checked)}/>
          <br />
          {/* TODO: Habria que ver tambien de agregar los Tags */}
          {categorias.length > 0 && (
            <Filtros
              filtros={categorias}
              setFiltros={setCategoriasFiltradas}
              filtro={'Categorias'}
            />
          )}
          <br />
          <Button variant="contained" component="label">
            Adjuntar Archivo
            <input type="file" hidden 
            onChange={(evt) => {
              setFile(evt.target.files)
              console.log(file)
            }}/>
          </Button>
          { file && {file} }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCrear}>Crear</Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


