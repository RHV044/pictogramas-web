import { useEffect, useState } from "react";

function randomNumberGenerator(inferior, superior) {
    var numPosibilidades = superior - inferior;
    var aleatorio = Math.random() * (numPosibilidades + 1);
    aleatorio = Math.floor(aleatorio);
    return inferior + aleatorio;
}

type SumaVerificadora = {
    number1: number;
    number2: number;
    resultadoCorrecto?: number;
};


export default function Operacion(props: any) {

    const [suma, setSuma] = useState(null as SumaVerificadora | null);

    useEffect(() => {
        let number1 = randomNumberGenerator(1, 10);
        let number2 = randomNumberGenerator(1, 10);
        let resultadoCorrecto = number1 + number2;

        setSuma({
            number1: number1,
            number2: number2,
            resultadoCorrecto: resultadoCorrecto,
        })

        props.setResultadoCorrecto(resultadoCorrecto);
    }, [])
    
    return (
        <div>
            { 
            suma && 
                <div>
                    Resultado de la operacion {suma.number1} + {suma.number2}: 
                </div>
            }
        </div>
    )
};