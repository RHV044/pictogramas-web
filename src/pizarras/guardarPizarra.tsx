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
import { formatDate } from '../pictogramas/services/pictogramas-services';


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

  useEffect(() => {
    let pizarraActual = props.obtenerPizarra() as IPizarra
    setPizarra(pizarraActual)
    if(pizarraActual.nombre !== "")
    {      
      setNombre(pizarraActual.nombre)   
      setActualizacion(true) 
      setNombreOriginal(pizarraActual.nombre)
    }
  }, [props.nombrePizarra]);

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
    //TODO: Revisar funcionamiento con asincronismo
    IndexedDbService.create().then((db) => {
      if (pizarraActual)
      {
        let newId = parseInt(Date.now().toString().substring(5,13))
        console.log(newId)
        pizarraActual.id = newId
        db.putOrPatchValue("pizarras", pizarraActual)
        dispatchEvent(new CustomEvent('sincronizar'));
      }
    });
    setOpen(false);
  };

  const handleActualizar = () => {
    let pizarraActual = props.obtenerPizarra() as IPizarra
    pizarraActual.nombre = nombre
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    pizarraActual.ultimaActualizacion = localISOTime
    //TODO: Revisar funcionamiento con asincronismo
    IndexedDbService.create().then((db) => {
      if (pizarraActual)
      {
        db.putOrPatchValue("pizarras", pizarraActual)
        dispatchEvent(new CustomEvent('sincronizar'));
      }
    });
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Guardar Pizarra
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Creacion de Pizarra</DialogTitle>
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
            <Button className="sincronizar" onClick={handleCrear}>Crear Nueva Pizarra</Button>
          }
          { actualizacion && 
            <Button className="sincronizar" onClick={handleActualizar}>Actualizar</Button> 
          }
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


