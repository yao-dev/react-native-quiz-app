import { GAME_PLAYERS_UPDATE } from "../constants"

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
  gamePlayersUpdate
}
