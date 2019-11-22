import axios from 'axios';
import { db } from "./firebase";

const gamesRef = db.ref('/games');
const playersRef = db.ref('/players');

const create = async (categoryUrl) => {
  const gameId = Math.random().toString(36).substr(2, 1); // 2, 6
  const uniqGameRef = gamesRef.child(gameId);
  const questions = await fetchQuestions(categoryUrl)

  uniqGameRef.set({
    createdAt: new Date(),
    players: {},
    categoryUrl,
    questions
  })

  return gameId;
}

const addPlayer = (player) => {
  const newPlayer = {
    createdAt: new Date(),
    points: 0,
    ...player
  }
  // ADD PLAYER TO GAME
  const { key } = gamesRef.child(newPlayer.gameId).child('players').push(newPlayer)
  // ADD PLAYER TO PLAYERS
  playersRef.child(key).set(newPlayer)
  return {
    id: key,
    ...newPlayer
  }
}

const getPlayer = async (id) => {

}

const join = () => {

}

const getPlayers = async (gameId) => {

}

const getById = (gameId) => {
  return new Promise((resolve, reject) => {
    gamesRef.child(gameId).once('value', (snapshot) => {
      resolve(snapshot.val())
    })
  })
}

const fetchQuestions = async (url) => {
  try {
    const { data } = await axios.get(url);
    let results = []

    if (data.results) {
      results = data.results.map((result) => {
        result.answers = [result.correct_answer].concat(result.incorrect_answers);
        // result.answers.disorder();

        delete result.incorrect_answers;

        return result;
      })
    }
    return results;
  } catch (e){
    console.log(e)
    return []
  }
}

const formatPlayers = (players) => {
  return Object.keys(players).map((playerId) => {
    return {
      id: playerId,
      ...players[playerId]
    }
  })
}

export default {
  create,
  addPlayer,
  getPlayer,
  getPlayers,
  join,
  getById,
  formatPlayers
}
