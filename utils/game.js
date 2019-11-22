import axios from 'axios';
import { db } from "./firebase";

const gamesRef = db.ref('/games');
const playersRef = db.ref('/players');

const create = async (categoryUrl) => {
  const gameId = Math.random().toString(36).substr(2, 5); // 2, 6
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
        result.question = formatString(result.question)
        result.answers = [result.correct_answer].concat(result.incorrect_answers);
        result.answers = result.answers.map((item) => formatString(item))
        result.answers.disorder();

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

const formatString = (str) => {
  return str
  .replace(/&quot;/g, "\"")
  .replace(/&apos;/g, "'")
  .replace(/&#039;/g, "'")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, "")
  .replace(/&iexcl;/g, "¡")
  .replace(/&cent;/g, "¢")
  .replace(/&pound;/g, "£")
  .replace(/&curren;/g, "¤")
  .replace(/&yen;/g, "¥")
  .replace(/&brvbar;/g, "¦")
  .replace(/&sect;/g, "§")
  .replace(/&uml;/g, "¨")
  .replace(/&copy;/g, "©")
  .replace(/&ordf;/g, "ª")
  .replace(/&laquo;/g, "«")
  .replace(/&not;/g, "¬")
  .replace(/&shy;/g, "­")
  .replace(/&reg;/g, "®")
  .replace(/&macr;/g, "¯")
  .replace(/&deg;/g, "°")
  .replace(/&plusmn;/g, "±")
  .replace(/&sup2;/g, "²")
  .replace(/&sup3;/g, "³")
  .replace(/&acute;/g, "´")
  .replace(/&micro;/g, "µ")
  .replace(/&para;/g, "¶")
  .replace(/&middot;/g, "·")
  .replace(/&cedil;/g, "¸")
  .replace(/&sup1;/g, "¹")
  .replace(/&ordm;/g, "º")
  .replace(/&raquo;/g, "»")
  .replace(/&frac14;/g, "¼")
  .replace(/&frac12;/g, "½")
  .replace(/&frac34;/g, "¾")
  .replace(/&iquest;/g, "¿")
  .replace(/&times;/g, "×")
  .replace(/&divide;/g, "÷")
  .replace(/&Agrave;/g, "À")
  .replace(/&Aacute;/g, "Á")
  .replace(/&Acirc;/g, "Â")
  .replace(/&Atilde;/g, "Ã")
  .replace(/&Auml;/g, "Ä")
  .replace(/&Aring;/g, "Å")
  .replace(/&AElig;/g, "Æ")
  .replace(/&Ccedil;/g, "Ç")
  .replace(/&Egrave;/g, "È")
  .replace(/&Eacute;/g, "É")
  .replace(/&Ecirc;/g, "Ê")
  .replace(/&Euml;/g, "Ë")
  .replace(/&Igrave;/g, "Ì")
  .replace(/&Iacute;/g, "Í")
  .replace(/&Icirc;/g, "Î")
  .replace(/&Iuml;/g, "Ï")
  .replace(/&ETH;/g, "Ð")
  .replace(/&Ntilde;/g, "Ñ")
  .replace(/&Ograve;/g, "Ò")
  .replace(/&Oacute;/g, "Ó")
  .replace(/&Ocirc;/g, "Ô")
  .replace(/&Otilde;/g, "Õ")
  .replace(/&Ouml;/g, "Ö")
  .replace(/&Oslash;/g, "Ø")
  .replace(/&Ugrave;/g, "Ù")
  .replace(/&Uacute;/g, "Ú")
  .replace(/&Ucirc;/g, "Û")
  .replace(/&Uuml;/g, "Ü")
  .replace(/&Yacute;/g, "Ý")
  .replace(/&THORN;/g, "Þ")
  .replace(/&szlig;/g, "ß")
  .replace(/&agrave;/g, "à")
  .replace(/&aacute;/g, "á")
  .replace(/&acirc;/g, "â")
  .replace(/&atilde;/g, "ã")
  .replace(/&auml;/g, "ä")
  .replace(/&aring;/g, "å")
  .replace(/&aelig;/g, "æ")
  .replace(/&ccedil;/g, "ç")
  .replace(/&egrave;/g, "è")
  .replace(/&eacute;/g, "é")
  .replace(/&ecirc;/g, "ê")
  .replace(/&euml;/g, "ë")
  .replace(/&igrave;/g, "ì")
  .replace(/&iacute;/g, "í")
  .replace(/&icirc;/g, "î")
  .replace(/&iuml;/g, "ï")
  .replace(/&eth;/g, "ð")
  .replace(/&ntilde;/g, "ñ")
  .replace(/&ograve;/g, "ò")
  .replace(/&oacute;/g, "ó")
  .replace(/&ocirc;/g, "ô")
  .replace(/&otilde;/g, "õ")
  .replace(/&ouml;/g, "ö")
  .replace(/&oslash;/g, "ø")
  .replace(/&ugrave;/g, "ù")
  .replace(/&uacute;/g, "ú")
  .replace(/&ucirc;/g, "û")
  .replace(/&uuml;/g, "ü")
  .replace(/&yacute;/g, "ý")
  .replace(/&thorn;/g, "þ")
  .replace(/&yuml;/g, "ÿ")
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
