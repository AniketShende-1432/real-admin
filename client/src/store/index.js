import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";  // Import your authSlice
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: "auth",
    storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: { auth: persistedReducer },
});

export const persistor = persistStore(store);
