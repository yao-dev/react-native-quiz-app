import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const { width, height } = Dimensions.get('window');

/**
 * Disorder the array
 *
 * @param {bool} preserve Returns a copy without modifying the original
 * @return {array} The disordered array
 */
Array.prototype.disorder = function (preserve) {
	var array = preserve ? this.slice() : this;
	var disordered = [];

	while(array.length > 0) {
		var index = Math.round(Math.random()*(array.length-1));
		disordered.push(array[index]);
		array.splice(index, 1);
	}

	if(!preserve) {
		Array.prototype.push.apply(this, disordered);
	}

	return disordered;
};

const gameData = {"response_code":0,"results":[{"category":"Entertainment: Board Games","type":"multiple","difficulty":"easy","question":"In a standard game of Monopoly, what colour are the two cheapest properties?","correct_answer":"Brown","incorrect_answers":["Green","Yellow","Blue"]},{"category":"Entertainment: Music","type":"multiple","difficulty":"easy","question":"Who is the lead singer of Pearl Jam?","correct_answer":"Eddie Vedder","incorrect_answers":["Ozzy Osbourne","Stone Gossard","Kurt Cobain"]},{"category":"Entertainment: Music","type":"multiple","difficulty":"hard","question":"Which of these artists did NOT remix the song &quot;Faded&quot; by Alan Walker?","correct_answer":"Skrillex","incorrect_answers":["Ti&euml;sto","Slushii","Dash Berlin"]},{"category":"Animals","type":"multiple","difficulty":"easy","question":"How many legs do butterflies have?","correct_answer":"6","incorrect_answers":["2","4","0"]},{"category":"Entertainment: Music","type":"multiple","difficulty":"medium","question":"Which artist collaborated with American DJ Dillon Francis to release the song 2016 &quot;Need You&quot;?","correct_answer":"NGHTMRE","incorrect_answers":["LOUDPVCK","KRNE","DVBBS"]},{"category":"Science: Computers","type":"multiple","difficulty":"medium","question":"What is the correct term for the metal object in between the CPU and the CPU fan within a computer system?","correct_answer":"Heat Sink","incorrect_answers":["CPU Vent","Temperature Decipator","Heat Vent"]},{"category":"Geography","type":"multiple","difficulty":"hard","question":"When does Finland celebrate their independence day?","correct_answer":"December 6th","incorrect_answers":["January 2nd","November 12th","February 8th"]},{"category":"Vehicles","type":"multiple","difficulty":"hard","question":"What model was the sports car gifted to Yuri Gagarin by the French government in 1965?","correct_answer":"Matra Djet","incorrect_answers":["Porsche 911","Alpine A110","AC Cobra"]},{"category":"Entertainment: Board Games","type":"multiple","difficulty":"hard","question":"Which character class in Dungeons and Dragons 5th edition gains it&#039;s powers from making a pact with a being of higher power?","correct_answer":"Warlock","incorrect_answers":["Wizard","Sorceror","Cleric"]},{"category":"Mythology","type":"multiple","difficulty":"medium","question":"According to Japanese folklore, what is the favorite food of the Kappa.","correct_answer":"Cucumbers","incorrect_answers":["Kabocha","Nasu","Soba"]}]}

const letters = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
}

const styles = {
  container: {
    margin: 20,
    // marginHorizontal: 10,
  },
  quizInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  lastTime: {
    color: '#e84118',
  },
  questionRemaining: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c63ff',
  },
  question: {
    fontSize: 18,
    marginBottom: 50
  },
  questionIndex: {
    fontWeight: 'bold',
    color: '#6c63ff',
  },
  answerButton: {
    flexFlow: 'row wrap',
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: '#FFF',
    width: '100%',
    paddingVertical: 15,
    paddingLeft: 20,
    borderRadius: 50,
    marginBottom: 10,
    elevation: 5,
  },
  answerButtonCorrect: {
    backgroundColor: '#4cd137',
  },
  answerButtonIncorrect: {
    backgroundColor: '#e84118',
  },
  answer: {
    fontSize: 16,
  },
  answerText: {
    // position: 'relative',
    // left: 50
  },
  answerIndex: {
    fontWeight: 'bold',
    color: '#6c63ff',
  }
}

const Game = ({ navigation, ...props }) => {
  const [state, setState] = useState({
    time: 10,
    questionNumber: 0,
    endGame: false,
    mode: 0,
    displayAnswer: false,
    selectedAnswer: '',
  }) // 0 = single; 1 = multiplayer (state.mode)
  const timerRef = useRef();
  const displayAnswerRef = useRef();
  const progressBarRef = useRef();
  const gameData = navigation.state.params.gameData;
  const currentGame = gameData[state.questionNumber] || {};
  const question = currentGame.question;
  const correctAnswer = currentGame.correct_answer;
  let answers = [currentGame.correct_answer].concat(currentGame.incorrect_answers);

  selectAnswer = (answer) => {
    // correctAnswer === answer
    setState(prevState => ({
      ...prevState,
      displayAnswer: true,
      selectedAnswer: answer
    }))
  }

  useEffect(() => {
    answers = answers.disorder();
  }, [state.questionNumber])

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      // END GAME
      if (state.questionNumber + 1 === gameData.length) {
        clearTimeout(timerRef.current)
        setState(prevState => ({
          ...prevState,
          displayAnswer: true,
          endGame: true
        }))
      } else {
        if (!state.time || state.displayAnswer) return clearTimeout(timerRef.current)
        setState(prevState => ({
          ...prevState,
          time: !state.time ? prevState.time : prevState.time - 1,
          displayAnswer: !(prevState.time - 1),
        }))
      }
    }, 1000)
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [state.time, state.displayAnswer]);

  useEffect(() => {
    if (state.displayAnswer) {
      displayAnswerRef.current = setTimeout(() => {
        clearTimeout(displayAnswerRef.current)
        setState(prevState => ({
          ...prevState,
          displayAnswer: false,
          time: 10,
          questionNumber: prevState.questionNumber + 1,
          selectedAnswer: ''
        }))
      }, 1000)
    }

    if (state.endGame) {
      navigation.navigate('EndGame')
    }

    return () => {
      clearTimeout(displayAnswerRef.current)
    }
  }, [state.displayAnswer, state.endGame]);

  // Prevent to display question/answer when game is finish
  if (state.questionNumber + 1 === gameData.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* TIME & QUESTION NUMBER */}
      <View style={{ marginBottom: 50 }}>
        <View style={styles.quizInfo}>
          <Text style={[styles.time, state.time <= 3 && styles.lastTime]}>Time left: {state.time}sec</Text>
          <Text style={styles.questionRemaining}>{state.questionNumber + 1}/{gameData.length}</Text>
        </View>
        <ProgressBar
          progress={state.time / 10}
          width={width - styles.container.margin * 2}
          color='#6c63ff'
          unfilledColor='#EDEDFC'
          borderColor='transparent'
        />
      </View>

      <Text style={styles.question}>
        <Text style={styles.questionIndex}>{state.questionNumber + 1}.</Text> {escapeHtml(question)}
      </Text>

      {answers.map((answer, index) => {
        const answerNumber = index + 1;
        const isCorrectAnswer = answer === correctAnswer;
        const selectedAnswer = answer === state.selectedAnswer;
        return (
          <TouchableOpacity
            key={answer}
            onPress={() => selectAnswer(answer)}
            disabled={state.displayAnswer}
            style={[
              styles.answerButton,
              state.displayAnswer && isCorrectAnswer && styles.answerButtonCorrect,
              selectedAnswer && !isCorrectAnswer && styles.answerButtonIncorrect,
            ]}
          >
            <Text style={styles.answer}>
              <Text style={styles.answerIndex}>{letters[answerNumber]}.</Text> <Text style={styles.answerText}>{escapeHtml(answer)}</Text>
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  );
}

Game.navigationOptions = {
  title: 'QUIZ'
}

export default Game;