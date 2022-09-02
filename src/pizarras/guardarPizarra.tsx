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
import { IPizarra } from './models/pizarra';
import { GuardarPizarra as SavePizarra } from './services/pizarras-services';
import { IndexedDbService } from '../services/indexeddb-service';


export default function GuardarPizarra(props:any) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("" as string)

  useEffect(() => {
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCrear = () => {
    let pizarraActual = props.obtenerPizarra() as IPizarra
    pizarraActual.nombre = nombre
    console.log("pizarra a guardar: ", pizarraActual)
    //TODO: Chequear si responde con el id de pizarra
    let pizarra = SavePizarra(pizarraActual)
    //TODO: Revisar guardado en el index db y si es posible mejorar
    // IndexedDbService.create().then((db) => {
    //   db.putOrPatchValue("pizarras", pizarra)
    // });
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Guardar Pizarra
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Creacion de Pictograma</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nombre para su pizarra
          </DialogContentText>
          <br />
          <TextField id="outlined-basic" label="Nombre" variant="outlined" 
            value={nombre} onChange={(evt) => setNombre(evt.target.value)} />
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCrear}>Crear</Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


