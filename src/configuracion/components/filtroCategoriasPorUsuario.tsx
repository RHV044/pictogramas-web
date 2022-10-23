import { Autocomplete, Checkbox, FormControlLabel, getCheckboxUtilityClass, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ICategoriaPorUsuario } from "../../pictogramas/models/categoriaPorUsuario";

export default function FiltroCategoriasPorUsuario(props: any) {

  const [filtrosSeleccionados, setfiltrosSeleccionados] = useState([] as any[]);
  const [filtros, setFiltros] = useState(props.filtros as any[]); 
  const [categoriasPorUsuario, setCategoriasPorUsuario] = useState([] as ICategoriaPorUsuario[]);

  let filtrosDesmarcados = [];

  useEffect(() => {
    console.log("USE EFFECT 1", props.categoriasDeUsuario);
    setCategoriasPorUsuario(props.categoriasDeUsuario);
    setfiltrosSeleccionados(props.filtros.filter(cat => props.categoriasDeUsuario.some(c => c.idCategoria === cat.id)));
  }, [])

  useEffect(() => {
    console.log("USE EFFECT 2", props.categoriasDeUsuario);
    setCategoriasPorUsuario(props.categoriasDeUsuario);
    setfiltrosSeleccionados(props.filtros.filter(cat => props.categoriasDeUsuario.some(c => c.idCategoria === cat.id)));
  }, [props.categoriasDeUsuario])



  // useEffect(() => {
  //     let usuario = getUsuarioLogueado();
  //     let categoriasDeUsuario = 
  //     setCategoriasPorUsuario(searchCategoriasPorUsuarioByUser(usuario.id));
  // }, [])

  function handleSelected(idCategoria: number) {
      return categoriasPorUsuario.some(cat => cat.idCategoria === idCategoria); //categoriasPorUsuario vacio?
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
                checked={selected} //handleSelected(Number(option.idCategoria))
                onClick={() => { 
                  if(!selected)
                  { 
                    // if(categoriasPorUsuario.map(cat => cat.idCategoria).includes(option.idCategoria)){
                    //     filtrosDesmarcados.push(option);
                    // }                   
                    console.log("valor selected: " + selected + " IF");
                    let newFilters = [...filtrosSeleccionados]
                    newFilters.push(option)
                    props.setFiltros(newFilters)
                    setfiltrosSeleccionados(newFilters)
                    
                    console.log(filtrosDesmarcados);
                    console.log('Filtros seleccionados: ', filtrosSeleccionados)
                  }
                  else {
                    console.log("valor selected: " + selected + " - ELSE");
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


