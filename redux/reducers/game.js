import { GAME_PLAYERS_UPDATE, SET_GAME_ID, SET_PLAYER_ID } from "../constants";

const initialState = {
  id: null,
  playerId: null,
  players: []
}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GAME_ID:
      return {
        ...state,
        id: action.payload.gameId,
      }
    case SET_PLAYER_ID:
      return {
        ...state,
        playerId: action.payload.playerId,
      }
    case GAME_PLAYERS_UPDATE: {
      // const gameId = action.payload.gameId;
      const players = action.payload.players;
      // const currentGame = state[gameId] || {};

      const newState = {
        ...state,
        ...currentGame,
        players,
        // [gameId]: {
        //   ...currentGame,
        //   players
        // }
      }
      return newState;
    }
    default:
      return state
  }
}

export default appReducer;
