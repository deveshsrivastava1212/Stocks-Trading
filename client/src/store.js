import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = rootReducer;

const persistConfig = {
  key: "root",
  storage,
};

const middleware = [thunk];

const persistedReducer = persistReducer(persistConfig, reducers);

export let store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware))
);
export let persistor = persistStore(store);
