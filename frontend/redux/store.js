
import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import UserReducer from './UserReducer';
import TeamReducer from './TeamReducer';
import AppDataReducer from './AppDataReducer';

const initialState = {};

//const middleware = [thunk, logger];
const middleware = [thunk];

const reducers = combineReducers({
  userData: UserReducer,
  teamData: TeamReducer,
  appData: AppDataReducer
});

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: [
    'userData','teamData', 'appData'
  ],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [
    //'teamData','tempData'
  ],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Redux: Store
const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middleware)),
);
// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {
    store,
    persistor,
};
