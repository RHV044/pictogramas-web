import axios from "axios";

const apiArasaac = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

export async function ObtenerUsuarios(
  setUsuarios: any
) {
  // axios.get(apiArasaac + '/usuarios')
  //   .then(response => {
  //     console.log('obtuvimos los usuarios')
  //     console.log(response.data)
  //     setUsuarios(response.data)
  //   })
  setUsuarios([{id: 1, username: 'gvaquero', password: '123'},{id: 2, username: 'leo', password: '123'}])
}