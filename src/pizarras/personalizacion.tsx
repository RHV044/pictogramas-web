import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';

export default function EstilosFormDialog(props: any) {
  const [open, setOpen] = useState(false);
  const { filas, columnas } = props

  useEffect(() => {
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
        Dar estilos
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Estilos para la pizarra</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Puede dar estilos por fila, columna o a una celda en especifico
            Filas: {filas} - Columnas: {columnas}
          </DialogContentText>
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCrear}>Aceptar</Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


