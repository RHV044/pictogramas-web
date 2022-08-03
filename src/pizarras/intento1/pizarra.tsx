import { CSSProperties, FC, useState } from 'react';
import { useMemo } from 'react';

import { Button, TextField } from '@mui/material';
import { Tabla } from './tabla';
import { Grafico } from './grafico';


const containerStyle: CSSProperties = {
  width: 500,
  height: 500,
  border: '1px solid gray',
};

/**
 * The Chessboard Tutorial Application
 */
export const Pizarra: FC = () => {
  const [filas, setFilas] = useState(8);
  const [columnas, setColumnas] = useState(8);
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
      <br />
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
      <div style={containerStyle}>
        <Tabla filas={filas} columnas={columnas} />
      </div>
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
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
        {textos.map(texto =>{
          return(<Grafico texto={texto} key={texto} />)
        })}

        </div>
      </div>
    </div>
  );
};
