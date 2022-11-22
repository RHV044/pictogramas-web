import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, TextField } from "@mui/material";
import { SourceMap } from "module";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Operacion from './operacion';
import { AddRounded, AttachFileRounded, CancelRounded, CheckRounded, PlusOneRounded, SaveRounded } from '@mui/icons-material';

export default function FormDialogValidarAcceso(props: any) {
    const [resultado, setResultado] = useState(null as number | null);
    const [resultadoCorrecto, setResultadoCorrecto] = useState(null as number | null);

    let navigate = useNavigate();

    const handleClose = () => {
        props.cerrarValidarConfiguracion()
    }
    
    return (
        <div>
            <Dialog open={true} onClose={handleClose}>
                <DialogTitle sx={{color: "#00A7E1"}}>Control de acceso</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Operacion setResultadoCorrecto={setResultadoCorrecto} />
                    </DialogContentText>
                    <br />
                    <TextField
                        id="resultado-input"
                        label="Resultado"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} //TODO revisar
                        value={resultado} //if si no hay valor en el parse int
                        onChange={(evt) => {
                            if(evt.target.value != null){
                                setResultado(parseInt(evt.target.value));
                            } else {
                                console.log("input vacio");
                            }
                        }                            
                        }
                        type="number"
                        /> 
                </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { handleClose() }} variant="outlined" 
                            startIcon={<CancelRounded />}
                            sx={{fontFamily:'Arial', fontWeight:'bold', color:'#00A7E1'}}>
                                Cancelar
                        </Button>
                        <Button onClick={() => {
                                handleClose()
                                if(resultado === resultadoCorrecto){
                                navigate('../configuracion');
                                } else {
                                    alert("resultado incorrecto");
                                }
                            }} variant="contained" startIcon={<CheckRounded />}
                            sx={{fontFamily:'Arial', fontWeight:'bold', background:'#00A7E1'}}>
                                Confirmar
                        </Button>
                    </DialogActions>
                
            </Dialog>
        </div>
    )
}