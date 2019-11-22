import { GAME_PLAYERS_UPDATE, SET_GAME_ID, SET_PLAYER_ID } from "../constants"

const setGameId = (gameId) => {
  return {
    type: SET_GAME_ID,
    payload: {
      gameId,
    }
  }
}

const setPlayerId = (playerId) => {
  return {
    type: SET_PLAYER_ID,
    payload: {
      playerId,
    }
  }
}

const gamePlayersUpdate = ({ gameId, players }) => {
  return {
    type: GAME_PLAYERS_UPDATE,
    payload: {
      gameId,
      players,
    }
  }
}

export default {
  gamePlayersUpdate,
  setGameId,
  setPlayerId
}
