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

    let suma: SumaVerificadora = {
        number1 : randomNumberGenerator(0, 10),
        number2 : randomNumberGenerator(0, 10) 
    }

    suma.resultadoCorrecto = suma.number1 + suma.number2;
    
    return (
        <div>
            Resultado de la operacion {suma.number1} + {suma.number2}:
        </div>
    )
};