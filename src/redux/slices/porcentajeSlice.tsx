import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PorcentajeState {
  value: number
}

const initialState: PorcentajeState = {
  value: 0,
}

export const porcentajeSlice = createSlice({
  name: 'porcentaje',
  initialState,
  reducers: {
    changeValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeValue } = porcentajeSlice.actions

export default porcentajeSlice.reducer