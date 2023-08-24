import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartReducer';
import UI from './UI';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    UI: UI
  },
});

export default store;