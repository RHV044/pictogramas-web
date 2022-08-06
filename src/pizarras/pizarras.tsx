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
import { useEffect, useMemo, useState } from 'react';
import ResponsiveAppBar from '../commons/appBar';
import { CellDrop } from './cellDrop';
import { Trash } from './trash';
import { Ejemplo } from './example/ejemplo';
import { Pizarra } from './intento2/pizarra';
import { Grafico, Movimientos } from './movimientos';

export default function Pizarras(this: any) {
  const [filas, setFilas] = useState(0);
  const [columnas, setColumnas] = useState(0);
  const [texto, setTexto] = useState('')
  const movimientos = useMemo(() => new Movimientos(), []);
  const [refresco, setRefresco] = useState(false)

  function agregarTexto() {
    setTexto('');
    let grafico = {esPictograma: false, imagen: '', posicion: {columna: -1, fila: -1}, texto: texto} as Grafico
    movimientos.agregarGrafico(grafico)
  }

  function agregarPictograma(){
    let grafico = {esPictograma: true, imagen: '', posicion: {columna: -1, fila: -1}, texto: ''} as Grafico
    //movimientos.agregarGrafico(grafico)
  }

  function eliminarTexto(texto: string) {
  }

  function refrescar(){
    //Esto es una falopeada pero necesito que se refresque, igual solo anda la primera vez
    console.log('se debe refrescar: ', refresco)
    let nuevoRefresco = refresco === true ? false : true
    console.log('nuevo refresco: ', nuevoRefresco)
    setRefresco(nuevoRefresco)
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
        onChange={(evt) => {
          let cantidad = parseInt(evt?.target?.value)          
          setFilas(cantidad ? cantidad : 0)
        }}
        size="small"
      />
      <TextField
        style={{ marginLeft: 5 }}
        label="Columnas"
        id="outlined-size-small"
        value={columnas}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        onChange={(evt) => {
          let cantidad = parseInt(evt?.target?.value) 
          setColumnas(cantidad ? cantidad : 0)
        }}
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
                          <CellDrop fila={f} columna={c} name='celda' onDrop={() => { refrescar()}} movimientos={movimientos} />
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
      <Button style={{marginLeft: 5, marginRight: 5}} variant="contained" component="label" onClick={() => {
        agregarTexto(); 
      }}>
        Agregar Texto
      </Button>
      <br/>
      <TextField
        style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }}
        label="Buscar Pictograma"
        id="outlined-size-small"
        //value={}
        //onChange={(evt) => }
        size="small" 
        onKeyDown={(e) => {
          if(e.keyCode == 13){
            agregarPictograma()
          }
        } 
      }      
      />
      <Button style={{marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5}} variant="contained" component="label">
        Agregar Pictograma
      </Button>
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
        {movimientos.getGraficos().map(grafico => {
          if (grafico.posicion.columna === -1 && grafico.posicion.fila === -1)
            return(<Box name={grafico.texto} key={grafico.texto} movimientos={movimientos} fila={-1} columna={-1} onDrop={() => { refrescar()}}/>)
        })}
        {refresco && <></>}
        </div>
      </div>
      <Trash movimientos={movimientos} name='Tachito' onDrop={(evt) => {
        console.log(evt)
      }}/>
      {/* <br />
      <br />
      <br />
      <Ejemplo></Ejemplo>
      <br />
      <br />
      <br />
      Ejemplo 2
      <br />
      <Pizarra></Pizarra> */}
    </div>
  );
}
