import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Input, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function FormDialogValidarAcceso() {
    const [open, setOpen] = useState(false);
    const [resultado, setResultado] = useState("" as string);
    
    let navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
    }
    
    const handleClickOpen = () => {
        setOpen(true);
      };
    

    return (
        <div>
            <Dialog open={true} onClose={handleClose}>
                <DialogTitle>Control de acceso</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Cual es el resultado de 2+2?                        
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