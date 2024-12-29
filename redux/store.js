import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlices' // Ensure the correct path
import songReducer from "./slices/songSlice"
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    songs: songReducer,
  },
})

export default store  // Add default export
