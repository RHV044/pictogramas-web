import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Box } from './draggableBox';
import { useState } from 'react';
import ResponsiveAppBar from '../commons/appBar';
import { CellDrop } from './cellDrop';
import { Trash } from './trash';

export default function Pizarras(this: any) {
  const [filas, setFilas] = useState(0);
  const [columnas, setColumnas] = useState(0);
  const [texto, setTexto] = useState('')
  const [textos, setTextos] = useState([] as string[])

  function agregarTexto() {
    let textosCopy = textos;
    textosCopy.push(texto);
    setTextos(textosCopy);
    setTexto('');
  }

  function eliminarTexto(texto: string) {
    let textosCopy = textos;
    textosCopy.filter(t => t != texto);
    setTextos(textosCopy);
  }

  return (
    <div>
      <ResponsiveAppBar />
      <TextField
        style={{ marginLeft: 5 }}
        label="Filas"
        id="outlined-size-small"
        value={filas}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        onChange={(evt) => setFilas(parseInt(evt?.target?.value))}
        size="small"
      />
      <TextField
        style={{ marginLeft: 5 }}
        label="Columnas"
        id="outlined-size-small"
        value={columnas}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        onChange={(evt) => setColumnas(parseInt(evt?.target?.value))}
        size="small"
      />
      <br />
      <Table component={Paper}>
        <Table sx={{ width: '100%', height: '100%' }} aria-label="simple table">
          <TableHead></TableHead>
          <TableBody>
            {Array.from(Array(filas), (e, f) => {
              return (
                <TableRow key={f}>
                  {Array.from(Array(columnas), (d, c) => {
                    return (
                      <TableCell key={f + '-' + c}>
                        <div style={{ overflow: 'hidden', clear: 'both' }}>
                          <CellDrop name='celda' onDrop={() => {}} />
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Table>
      <br />
      <TextField
        style={{ marginLeft: 5 }}
        label="Texto para agregar"
        id="outlined-size-small"
        value={texto}
        onChange={(evt) => setTexto(evt?.target?.value)}
        size="small" 
        onKeyDown={(e) => {
          if(e.keyCode == 13){
            agregarTexto()
          }
        } 
      }      
      />
      <Button variant="contained" component="label" onClick={() => {
        agregarTexto(); 
      }}>
        Agregar Texto
      </Button>
      <Button variant="contained" component="label">
        Agregar Pictograma
      </Button>
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
        {textos.map(texto =>{
          return(<Box name={texto} key={texto} onDrop={() => { eliminarTexto(texto)}}/>)
        })}

        </div>
      </div>
      <Trash name='Tachito' onDrop={(evt) => {
        console.log(evt)
        eliminarTexto('gonza')
      }}/>
    </div>
  );
}
