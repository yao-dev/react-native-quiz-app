import { GAME_PLAYERS_UPDATE } from "../constants";

const initialState = {}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case GAME_PLAYERS_UPDATE: {
      const gameId = action.payload.gameId;
      const players = action.payload.players;
      const currentGame = state[gameId] || {};

      const newState = {
        ...state,
        [gameId]: {
          ...currentGame,
          players
        }
      }
      return newState;
    }
    default:
      return state
  }
}

export default appReducer;
