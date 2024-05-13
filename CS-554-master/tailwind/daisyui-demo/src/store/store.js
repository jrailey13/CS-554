import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { museumAPI } from "./services/museum";
import themeSlice from "./theme.slice";

export const store = configureStore({
  reducer: {
    [museumAPI.reducerPath]: museumAPI.reducer,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(museumAPI.middleware);
  },
});

setupListeners(store.dispatch);
