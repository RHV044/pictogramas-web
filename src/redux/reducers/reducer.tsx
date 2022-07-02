import * as actions from "../actions/action-types"

function reducer(state: any, action: {
  payload: any; type: any; id: any; 
}){
  let newState = [...state];
  switch (action.type){
      case actions.ACT_SET_USUARIO:
          return {
            ...state,
            usuario: action.payload.usuario
        }
      default:
          break;
  }

  return newState
}

export default reducer;