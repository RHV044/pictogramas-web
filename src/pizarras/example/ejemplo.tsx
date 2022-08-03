import { CSSProperties, FC, useState } from 'react';
import { useMemo } from 'react';

import { Tabla } from './tabla';
import { Game } from './game';
import { TextField } from '@mui/material';

export interface ChessboardTutorialAppState {
  knightPosition: [number, number];
}

const containerStyle: CSSProperties = {
  width: 500,
  height: 500,
  border: '1px solid gray',
};

/**
 * The Chessboard Tutorial Application
 */
export const Ejemplo: FC = () => {
  const game = useMemo(() => new Game(), []);
  const [filas, setFilas] = useState(8);
  const [columnas, setColumnas] = useState(8);

  return (
    <div>
      Ejemplo
      <br />
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
        <Tabla game={game} filas={filas} columnas={columnas} />
      </div>
    </div>
  );
};
