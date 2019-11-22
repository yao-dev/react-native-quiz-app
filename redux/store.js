import { combineReducers, createStore } from 'redux';
import gameReducer from './reducers/game';

const initialState = {};

const reducers = combineReducers({
  game: gameReducer
})

const store = createStore(reducers, initialState)

export default store;
