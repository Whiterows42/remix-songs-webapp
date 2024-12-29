// store/slices/songSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songs: [],
  activeCategory: "All",
};

const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
   
    setActiveCategorySlice: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
});

export const { setActiveCategorySlice } = songSlice.actions;
export const selectActiveCategory = (state) => state.songs.activeCategory;

export default songSlice.reducer;
