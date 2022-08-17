import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/system';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

export default function EstilosFormDialog(props: any) {
  const [open, setOpen] = useState(false);
  const { filas, columnas, estilos } = props  
  const [fila, setFila] = useState(0)
  const [columna, setColumna] = useState(0)
  const [color, setColor] = useColor("hex", "#121212")

  useEffect(() => {
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAceptar = () => {
    let nuevosEstilos = [...estilos]
    nuevosEstilos.map(e => {
      if(fila && columna)
      {
        if(e.fila === fila && e.columna === columna)
          return {...e, color:color}
      }
      else
      {
        if(fila)
        {
          if(e.fila === fila)
            return {...e, color:color}
        }
        if(columna){
          if(e.columna === columna)
            return {...e, color:color}
        }
      }
    })
    props.actualizarEstilos(nuevosEstilos)
    setOpen(false);
  };

  const handleRestablecer = () => {
    let nuevosEstilos = [...estilos]
    nuevosEstilos.map(e => e.color = 'white')
    props.actualizarEstilos(nuevosEstilos)
    setOpen(false);
  };

  const handleFilaChange = (event) => {
    setFila(event.target.value as number);
  };

  const handleColumnaChange = (event) => {
    setColumna(event.target.value as number);
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
            <br/>
            <Container>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Fila</InputLabel>
                  <Select
                    value={fila}
                    label="fila"
                    onChange={handleFilaChange}
                  >
                    <MenuItem value={0} key={0}>Ninguna</MenuItem>
                    {Array.from(Array(filas), (e, f) => {
                      return(<MenuItem value={f+1} key={f+1}>{f+1}</MenuItem>)
                    })}              
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Columna</InputLabel>
                  <Select
                    value={columna}
                    label="columna"
                    onChange={handleColumnaChange}
                  >
                    <MenuItem value={0} key={0}>Ninguna</MenuItem>
                    {Array.from(Array(columnas), (e, c) => {
                      return(<MenuItem value={c+1} key={c+1}>{c+1}</MenuItem>)
                    })}                 
                  </Select>
                </FormControl>
              </Box>
            </Container>
            {(fila > 0 || columna > 0) && 
              <div>
                Seleccione el color de fondo
                <ColorPicker width={456} height={228}
                    color={color}
                    onChange={setColor} hideHSV dark />;
                </div>
            }
          </DialogContentText>
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAceptar}>Aceptar</Button>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleRestablecer}>Restablecer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


