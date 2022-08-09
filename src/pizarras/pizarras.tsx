import {
  Button,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Box } from './draggableBox';
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useState } from 'react';
import ResponsiveAppBar from '../commons/appBar';
import { CellDrop } from './cellDrop';
import { Trash } from './trash';
import { Grafico, Movimientos } from './movimientos';
import { IPictogram } from '../pictogramas/models/pictogram';
import { ObtenerPictogramas } from '../pictogramas/services/pictogramas-services';
import { ICategoria } from '../pictogramas/models/categoria';
import Categorias from '../pictogramas/components/categorias';
import CategoriaSeleccionada from '../pictogramas/components/categoriaSeleccionada';
import PictogramasPorCategoria from '../pictogramas/components/pictogramasPorCategoria';

export default function Pizarras(this: any) {
  const [filas, setFilas] = useState(0);
  const [columnas, setColumnas] = useState(0);
  const [texto, setTexto] = useState('')
  const movimientos = useMemo(() => new Movimientos(), []);
  //const movimientos = new Movimientos()
  const [refresco, setRefresco] = useState(false)
  const [mostrarPictogramas, setMostrarPictogramas] = useState(false)
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [pictogramasSeleccionados, setPictogramasSeleccionados] = useState([] as IPictogram[]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    null as ICategoria | null
  );
  const [graficos, setGraficos] = useState([] as Grafico[])  
  const [render, setRender] = useState(true)
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), [])
  const update = useReducer(() => ({}), {})[1] as () => void

  const [graficosSinLugar, setGraficosSinLugar] = useState([] as Grafico[])

  useEffect(() => {
    ObtenerPictogramas().then((pictogramas) => {
      setPictogramas(pictogramas);
    });
  }, []);

  useEffect(()=>{
    let grafs = [...graficos]
    setGraficosSinLugar(grafs)
  },[graficos])

  useLayoutEffect(()=> {
    handleChange()
  },)

  const handleChange = () => { 
    let graf = movimientos.getGraficos()
    setGraficos(graf);     
    setRender(true) 
    if(!compararListas(graficos, graficosSinLugar)){
      let grafs = [...graficos]
      setGraficosSinLugar(grafs)
    }  
  }

  const compararListas = (array1: Grafico[], array2: Grafico[]) => {
    if (array1.length !== array2.length) return false;
  
    for (var i = 0; i < array2.length; i++) {
      if (array1.some(g => g.identificacion === array2[i].identificacion && 
        (g.posicion.columna !== array2[i].posicion.columna || g.posicion.fila !== array2[i].posicion.fila))){
          return false
        }
    }
    return true;
  };

  const UpdatePictogramas = (pics: IPictogram[]) => {    
    let pictogramaParaAgregar = pics[0]
    movimientos.agregarPictograma(pictogramaParaAgregar)
    setPictogramasSeleccionados([]);
  };

  function agregarTexto() {
    setTexto('');
    let grafico = {esPictograma: false, imagen: '', posicion: {columna: -1, fila: -1}, texto: texto, identificacion:Date.now().toString()} as Grafico
    movimientos.agregarGrafico(grafico)
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
                          <CellDrop fila={f} columna={c} name='celda' onDrop={() => {}} movimientos={movimientos} />
                          {/* <CellDrop fila={f} columna={c} name='celda' onDrop={() => {handleChange() }} movimientos={movimientos} /> */}
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
            //handleChange()
          }
        } 
      }      
      />
      <Button style={{marginLeft: 5, marginRight: 5}} variant="contained" component="label" onClick={() => {
        agregarTexto(); 
        handleChange()
      }}>
        Agregar Texto
      </Button>
      <br/>
      { pictogramas.length > 0 &&
        <div>
          <Switch 
            checked={mostrarPictogramas}
            onChange={(evt) => setMostrarPictogramas(evt?.target?.checked)}
          /> Mostrar Pictogramas
        </div>
      }
      {mostrarPictogramas &&
        <div>
          <TextField
            style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }}
            label="Buscar Pictograma"
            id="outlined-size-small"
            //value={}
            //onChange={(evt) => }
            size="small" 
            onKeyDown={(e) => {
              if(e.keyCode == 13){
              }
            } 
          }      
          />
          <br />
        </div>
      }
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
        { render && graficosSinLugar.map(grafico => {
          if (grafico.posicion.columna === -1 && grafico.posicion.fila === -1)
            {
              if(grafico.esPictograma === false)
                return(<Box name={grafico.texto} key={grafico.identificacion} movimientos={movimientos} identificacion={grafico.identificacion} 
                  fila={-1} columna={-1} esPictograma={false} imagen={''} onDrop={() => {handleChange() }}/>)
                  //fila={-1} columna={-1} esPictograma={false} imagen={''} onDrop={() => { }}/>)
              else
                return(<Box name={grafico.texto} key={grafico.identificacion} movimientos={movimientos} identificacion={grafico.identificacion} 
                  fila={-1} columna={-1} esPictograma={true} imagen={grafico.imagen} onDrop={() => { handleChange()}}/>)
                  //fila={-1} columna={-1} esPictograma={true} imagen={grafico.imagen} onDrop={() => { }}/>)
            }
        })}
        {refresco && <></>}
        </div>
      </div>
      <Trash movimientos={movimientos} name='Tachito' onDrop={(evt) => {
        // handleChange()
        console.log(evt)
      }}/>      

      { mostrarPictogramas && categoriaSeleccionada && (
        <div>
          <CategoriaSeleccionada
            categoriaSeleccionada={categoriaSeleccionada}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
          <PictogramasPorCategoria
            categoria={categoriaSeleccionada.id}
            setPictogramas={UpdatePictogramas}
            pictogramas={pictogramasSeleccionados}
          ></PictogramasPorCategoria>
        </div>
      )}

      { mostrarPictogramas &&
        <div>
          <br />
          <Categorias
            setPictogramas={UpdatePictogramas}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
        </div>
      }
    </div>
  );
}
