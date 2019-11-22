import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import { db } from '../../utils/firebase';

const { width } = Dimensions.get('window');

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
    backgroundColor: '#FFF',
    width: '100%',
    paddingVertical: 15,
    paddingLeft: 20,
    borderRadius: 50,
    marginBottom: 10,
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
  answerText: {},
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
    mode: 0, // 0 = single; 1 = multiplayer (state.mode)
    displayAnswer: false,
    selectedAnswer: '',

  })
  const timerRef = useRef();
  const displayAnswerRef = useRef();
  const gameData = navigation.state.params.gameData;
  const currentGame = gameData[state.questionNumber] || {};
  const question = currentGame.question;
  const correctAnswer = currentGame.correct_answer;
  const answers = currentGame.answers;
  const lastQuestion = state.questionNumber === (gameData.length - 1);


  const gameRef = db.ref('/games').child(props.game.id)
  const playerRef = db.ref('/games').child(props.game.id).child('players').child(props.game.playerId)

  selectAnswer = (answer) => {
    const isCorrectAnswer = answer === correctAnswer;

    if (isCorrectAnswer) {
      let points;

      playerRef.once('value', snapshot => {
        points = snapshot.val().points;
        playerRef.update({
          points: points + 5
        })
      })
    }

    setState(prevState => ({
      ...prevState,
      displayAnswer: true,
      selectedAnswer: answer,
      endGame: lastQuestion
    }))
  }

  const startPlaying = () => {
    setState(prevState => ({ ...prevState, startTime: moment() }))
    playerRef.update({
      isPlaying: true,
      gameComplete: false,
    })
  }

  const endPlaying = () => {
    playerRef.update({
      isPlaying: false,
      gameComplete: true,
      scoreTime: moment().diff(state.startTime)
    })
  }

  const handleGame = () => {
    timerRef.current = setTimeout(() => {
      // Clear timer after time finish or after displayed the answer
      if (!state.time || state.displayAnswer) {
        clearTimeout(timerRef.current)
      } else {
        // Decrement time & display answer after 10s
        setState(prevState => ({
          ...prevState,
          time: !state.time ? prevState.time : prevState.time - 1,
          displayAnswer: !(prevState.time - 1),
          endGame: lastQuestion && !(prevState.time - 1)
        }))
      }
    }, 1000)

    return () => {
      clearTimeout(timerRef.current)
    }
  }

  const resetGameForNextQuestion = () => {
    displayAnswerRef.current = setTimeout(() => {
      let shouldResetForNextQuestion = state.displayAnswer && state.questionNumber < (gameData.length - 1)

      if (shouldResetForNextQuestion) {
        clearTimeout(displayAnswerRef.current)
        setState(prevState => ({
          ...prevState,
          displayAnswer: false,
          time: 10,
          selectedAnswer: '',
          questionNumber: prevState.questionNumber + 1
        }))
      }
    }, 1000)

    return () => {
      clearTimeout(displayAnswerRef.current)
    }
  }

  const handleEndGame = () => {
    if (state.endGame) {
      // Player complete game
      endPlaying()
      // Save player's result & go to EndGame
      playerRef.once('value', snapshot => {
        let player = snapshot.val();
        gameRef.child('result').push(player)
        setTimeout(() => {
          navigation.navigate('EndGame')
        }, 1000)
      })
    }
  }

  // IS START PLAYING
  useEffect(startPlaying, [])
  // HANDLE GAME
  useEffect(handleGame, [state.time, state.displayAnswer]);
  // RESET GAME FOR NEXT QUESTION
  useEffect(resetGameForNextQuestion, [state.displayAnswer]);
  // HANDLE END GAME
  useEffect(handleEndGame, [state.endGame])

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
        <Text style={styles.questionIndex}>{state.questionNumber + 1}.</Text> {question}
      </Text>

      {answers && answers.map((answer, index) => {
        const answerNumber = index + 1;
        const isCorrectAnswer = answer === correctAnswer;
        const selectedAnswer = answer === state.selectedAnswer;

        // ANSWER BUTTONS
        return (
          <Button
            key={answer}
            background='white'
            onPress={() => selectAnswer(answer)}
            disabled={state.displayAnswer}
            style={[
              styles.answerButton,
              state.displayAnswer && isCorrectAnswer && styles.answerButtonCorrect,
              selectedAnswer && !isCorrectAnswer && styles.answerButtonIncorrect,
            ]}
          >
            <Text style={styles.answer}>
              <Text style={styles.answerIndex}>{letters[answerNumber]}.</Text> <Text style={styles.answerText}>{answer}</Text>
            </Text>
          </Button>
        )
      })}
    </View>
  );
}

Game.navigationOptions = {
  title: 'QUIZ'
}

export default connect(state => state)(Game);
