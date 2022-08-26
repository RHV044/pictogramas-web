import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Input, TextField } from "@mui/material";
import { SourceMap } from "module";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Operacion from './operacion';

export default function FormDialogValidarAcceso(props: any) {
    const [resultado, setResultado] = useState("" as string);

    let navigate = useNavigate();

    const handleClose = () => {
        props.cerrarValidarConfiguracion()
    }


    return (
        <div>
            <Dialog open={true} onClose={handleClose}>
                <DialogTitle>Control de acceso</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Operacion />
                    </DialogContentText>
                    <br />
                    <TextField
                        id="resultado-input"
                        label="Resultado"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        value={resultado}
                        onChange={(evt) => setResultado(evt.target.value)} />
                    <br /> <br />
                    <Button
                        variant="contained"
                        style={{ alignItems: 'center', margin: '10px' }}
                        onClick={() => {
                            handleClose()
                            navigate('../configuracion');
                        }}>
                        Confirmar
                    </Button>
                    <Button
                        variant="outlined"
                        style={{ alignItems: 'center', margin: '10px' }}
                        onClick={() => {
                            handleClose()
                        }}
                    >
                        Cancelar
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}