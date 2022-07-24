import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox } from '@mui/material';

const FormDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
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
            Seleccione las propiedades y categorias con las que cumple el pictograma para ayudar en la busqueda y filtrado
          </DialogContentText>
          Violento <Checkbox />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Crear</Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog
