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
  const [nombreOriginal, setNombreOriginal] = useState("" as string)
  const [pizarra, setPizarra] = useState(null as IPizarra | null)
  const [actualizacion, setActualizacion] = useState(false)

  useEffect(() => {
    let pizarraActual = props.obtenerPizarra() as IPizarra
    setPizarra(pizarraActual)
    if(pizarraActual.nombre !== "")
    {      
      setNombre(pizarraActual.nombre)   
      setActualizacion(true) 
      setNombreOriginal(pizarraActual.nombre)
    }
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
    pizarraActual.pendienteCreacion = true
    //TODO: El guardado en la api tiene que realizarse despues del guardado en el indexdb
    // y debe realizarse cuando se pueda, cuando se tenga conexion
    // utilizar update-service
    //TODO: Chequear si responde con el id de pizarra
    // let pizarra = SavePizarra(pizarraActual)
    //TODO: Revisar guardado en el index db y si es posible mejorar
    IndexedDbService.create().then((db) => {
      db.putOrPatchValue("pizarras", pizarra)
    });
    setOpen(false);
  };

  const handleActualizar = () => {
    let pizarraActual = props.obtenerPizarra() as IPizarra
    pizarraActual.nombre = nombre
    pizarraActual.pendienteActualizacion = true
    //TODO: El guardado en la api tiene que realizarse despues del guardado en el indexdb
    // y debe realizarse cuando se pueda, cuando se tenga conexion
    // utilizar update-service
    //TODO: Chequear si responde con el id de pizarra
    // let pizarra = SavePizarra(pizarraActual)
    //TODO: Revisar guardado en el index db y si es posible mejorar
    IndexedDbService.create().then((db) => {
      db.putOrPatchValue("pizarras", pizarra)
    });
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
          { (nombreOriginal === "" || nombreOriginal !== nombre) &&
            <Button onClick={handleCrear}>Crear Nueva Pizarra</Button>
          }
          { actualizacion && 
            <Button onClick={handleActualizar}>Actualizar</Button> 
          }
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


