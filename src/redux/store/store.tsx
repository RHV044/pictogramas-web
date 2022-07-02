import { createStore } from "redux";
import reducer from "../reducers/reducer";

const initialState = {
  usuario: ''
};

let store = createStore(reducer, initialState)

export default store