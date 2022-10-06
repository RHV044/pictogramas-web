import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox } from '@mui/material';
import Filtros from './filtros';
import { ICategoria } from '../models/categoria';
import { ObtenerCategorias } from '../services/pictogramas-services';
import { useEffect, useState } from 'react';
import { usuarioLogueado } from '../../services/usuarios-services';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IPictogram } from '../models/pictogram';
import { IPictogramaImagen, IPictogramaPropioImagen } from '../models/pictogramaImagen';

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState(
    [] as ICategoria[]
  );

  const [keyword, setKeyword] = useState("" as string) 
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [file, setFile] = useState(null as any)
  const [fileName, setFileName] = useState("" as string)
  const [fileBase64, setFileBase64] = useState(null as any)

  const [violento, setViolento] = useState(false)
  const [sexual, setSexual] = useState(false)
  const [esquematico, setEsquematico] = useState(false)
  const [aac, setAac] = useState(false)
  const [aacColor, setAacColor] = useState(false)
  const [skin, setSkin] = useState(false)
  const [hair, setHair] = useState(false)

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCrear = () => {
    let filtros: { [key: string]: boolean } = {};
    filtros.violento = violento
    filtros.sexual = sexual
    filtros.esquematico = esquematico
    filtros.aac = aac
    filtros.aacColor = aacColor
    filtros.skin = skin
    filtros.hair = hair
    const pictograma = {
      id: 0,
      idArasaac: 0,
      schematic: filtros.esquematico,
      sex: filtros.sexual,
      violence: filtros.violento,
      aac: filtros.aac,
      aacColor: filtros.aacColor,
      skin: filtros.skin,
      hair: filtros.hair,
      imagen: fileBase64,
      categorias: categoriasFiltradas, 
      fileName: fileName,
      file: fileBase64,
      keywords: [{keyword: keyword}],
      idUsuario: usuarioLogueado?.id, // TODO: Si no tenemos el id?
      identificador: usuarioLogueado?.id + '_' + keyword,
      pendienteCreacion: true
    }

    const imagen = {identificador: usuarioLogueado?.id + '_' + keyword, imagen: fileBase64} as IPictogramaPropioImagen 
    //TODO: Revisar - ASINCRONISMO
    IndexedDbService.create().then(db => {
      db.putOrPatchValueWithoutId("pictogramasPropios", pictograma)
      dispatchEvent(new CustomEvent('sincronizar'));
    })
    IndexedDbService.create().then(db => { 
      db.putOrPatchValueWithoutId("imagenesPropias", imagen)
      dispatchEvent(new CustomEvent('sincronizar'));
    })
    setOpen(false);
  };

  function getBase64(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      if(reader.result)
        setFileBase64(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  return (
    <div>
      <Button style={{marginBottom: 20}} variant="outlined" onClick={handleClickOpen}>
        Crear Pictograma
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Creacion de Pictograma</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccione las propiedades y categorias con las que cumple el
            pictograma para ayudar en la busqueda y filtrado
          </DialogContentText>
          <br />
          <TextField id="outlined-basic" label="Palabra" variant="outlined" 
            value={keyword} onChange={(evt) => setKeyword(evt.target.value)} />
          <br />
          Violento <Checkbox checked={violento} onChange={(e) => setViolento(e.target.checked)} />
          <br />
          Sexual <Checkbox checked={sexual} onChange={(e) => setSexual(e.target.checked)}/>
          <br />
          Esquematico <Checkbox checked={esquematico} onChange={(e) => setEsquematico(e.target.checked)}/>
          <br />
          Aac <Checkbox checked={aac} onChange={(e) => setAac(e.target.checked)}/>
          <br />
          Aac Color <Checkbox checked={aacColor} onChange={(e) => setAacColor(e.target.checked)}/>
          <br />
          Tiene piel <Checkbox checked={skin} onChange={(e) => setSkin(e.target.checked)}/>
          <br />
          Tiene pelo <Checkbox checked={hair} onChange={(e) => setHair(e.target.checked)}/>
          <br />
          {/* TODO: Habria que ver tambien de agregar los Tags */}
          {categorias.length > 0 && (
            <Filtros
              filtros={categorias.filter(c => c.esCategoriaFinal === true).sort((c1, c2) => c1.nombre.localeCompare(c2.nombre))}
              setFiltros={setCategoriasFiltradas}
              filtro={'Categorias'}
            />
          )}
          <br />
          <Button variant="contained" component="label">
            Adjuntar Archivo
            <input type="file" hidden 
            onChange={(evt) => { 
              if (evt.target.files){
                setFile(evt.target.files)
                setFileName(evt.target.files[0].name) 
                getBase64(evt.target.files[0]) 
              }          
              console.log(file)
            }}/>
          </Button>
          <br />
          {fileName !== "" && <div> Archivo: {fileName} </div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCrear}>Crear</Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


