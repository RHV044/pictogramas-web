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

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState(
    [] as ICategoria[]
  );
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [file, setFile] = useState(null as any)

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
          Violento <Checkbox />
          <br />
          Sexual <Checkbox />
          <br />
          Esquematico <Checkbox />
          <br />
          Aac <Checkbox />
          <br />
          Aac Color <Checkbox />
          <br />
          Tiene piel <Checkbox />
          <br />
          Tiene pelo <Checkbox />
          <br />
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
              setFile(evt.target.files ? evt.target.files[0].name : null)
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


