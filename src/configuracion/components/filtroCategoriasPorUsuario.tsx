import { Autocomplete, Checkbox, FormControlLabel, getCheckboxUtilityClass, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ICategoriaPorUsuario } from "../../pictogramas/models/categoriaPorUsuario";
import { IndexedDbService } from "../../services/indexeddb-service";
import { getUsuarioLogueado, ObtenerCategoriasPorUsuario } from "../../services/usuarios-services";

export default function FiltroCategoriasPorUsuario(props: any) {

  const [filtrosSeleccionados, setfiltrosSeleccionados] = useState([] as any[]);
  const [filtros, setFiltros] = useState(props.filtros as any[]); 
  const [categoriasPorUsuario, setCategoriasPorUsuario] = useState(props.categoriasDeUsuario as any[])
  
  // useEffect(() => {
  //     let usuario = getUsuarioLogueado();
  //     let categoriasDeUsuario = 
  //     setCategoriasPorUsuario(searchCategoriasPorUsuarioByUser(usuario.id));
  // }, [])

  function handleSelected(idCategoria: Number) {
      return categoriasPorUsuario.some(cat => cat.idCategoria === idCategoria)
  }

  return (
    <Grid container direction="row">
      <Grid item xs={12}>
        <Autocomplete
          value={filtrosSeleccionados}
          multiple
          id="tags-standard"
          options={filtros}
          getOptionLabel={(option) => option.nombre}
          disableCloseOnSelect
          defaultValue={filtrosSeleccionados}
          onChange={(event, value) => setfiltrosSeleccionados(value)}
          renderOption={(propps, option: any, { selected }) => (            
            <React.Fragment key={option.id}>
              <Checkbox
                style={{ color: '#d71920' }}
                checked={selected} //{handleSelected(option.id)}
                onClick={() => { 
                  if(!selected)
                  {
                    let newFilters = [...filtrosSeleccionados]
                    newFilters.push(option)
                    props.setFiltros(newFilters)
                    setfiltrosSeleccionados(newFilters)
                    console.log('Filtros seleccionados: ', filtrosSeleccionados)
                  }
                  else {
                    let filtrado = filtrosSeleccionados.filter(f => f.nombre !== option.nombre)
                    props.setFiltros(filtrado)
                    setfiltrosSeleccionados(filtrado)
                  }
                }}
              />
              {option.nombre}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={props.filtro}
              placeholder="Seleccione uno o varios filtros"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};


