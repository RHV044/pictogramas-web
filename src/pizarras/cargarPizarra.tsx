import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { ObtenerPizarras } from './services/pizarras-services';
import { IPizarra } from './models/pizarra';
import { usuarioLogueado } from '../services/usuarios-services';
import { IndexedDbService } from '../services/indexeddb-service';


export default function CargarPizarra(props: any) {
  const [open, setOpen] = useState(false);
  const [idPizarra, setIdPizarra] = useState(0 as number)
  const [pizarras, setPizarras] = useState([] as IPizarra[])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let usuarioId = usuarioLogueado?.id !== undefined ? usuarioLogueado?.id : 0;

    //TODO: Las pizarras solo las deberia obtener del indexdb, 
    // pero deberia actualizarlas con la api mediante update-service
    // ObtenerPizarras(usuarioId).then((piz : IPizarra[]) => {
    //   setPizarras(piz)
      //TODO: Verificar busqueda del indexDb
      // Se podria extraer en un metodo
      IndexedDbService.create().then((db) => {
        db.getAllValues("pizarras").then((pizarras : IPizarra[]) =>{
          let pizarrasParaAgregar = pizarras.filter((p: IPizarra) => p.usuarioId === usuarioId &&
           p.pendienteEliminacion !== true) 
          console.log("Pizarras: ", pizarrasParaAgregar)
          setPizarras(pizarrasParaAgregar)
          setCargando(false)
        })
      });
    // })    
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCrear = () => {
    let pizarra = pizarras.find(p => p.id === idPizarra)
    props.setPizarra(pizarra)
    setOpen(false);
  };

  const handleEliminar = () => {
    let pizarra = pizarras.find(p => p.id === idPizarra)
    if (pizarra)
    {
      pizarra.pendienteEliminacion = true
      IndexedDbService.create().then((db) => {
        db.putOrPatchValue("pizarras", pizarra)
      });

      //TODO: eliminar esta pizarra de las opciones actuales
    }
    setOpen(false);
  };

  return (
    <div>
      {/* TODO: Actualmente solo muestra la 1ra opcion, hay que ver como corregir */}
      <Button variant="outlined" onClick={handleClickOpen}>
        Cargar Pizarra
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cargar Pizarra</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccione la pizarra que desee cargar
          </DialogContentText>
          <br />
          { pizarras.length > 0 &&
            <Select
              value={idPizarra}
              label="fila"
              onChange={(evt) => {
                let id = evt.target.value as number
                setIdPizarra(id)
              }}
            >
              {Array.from(Array(pizarras), (e, f) => 
                (<MenuItem value={e[f].id} key={e[f].id}>{e[f].nombre}</MenuItem>)
              )}              
            </Select>
          }
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCrear}>Cargar</Button>
          { idPizarra > 0 &&<Button onClick={handleEliminar}>Eliminar Pizarra</Button>}
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


