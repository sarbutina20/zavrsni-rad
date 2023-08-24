import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "UI",
  initialState: {
    showCart: false
  },
  reducers: {
    toggleCart(state) {
        state.showCart = !state.showCart
    }
  },
});

export const { toggleCart } = uiSlice.actions;

export default uiSlice.reducer;