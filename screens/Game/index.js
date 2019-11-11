import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

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
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      }
    }),
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

  selectAnswer = (answer) => {
    setState(prevState => ({
      ...prevState,
      displayAnswer: true,
      selectedAnswer: answer
    }))
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      // END GAME
      if (state.questionNumber === (gameData.length - 1)) {
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
    if (state.displayAnswer && state.questionNumber < (gameData.length - 1)) {
      displayAnswerRef.current = setTimeout(() => {
        clearTimeout(displayAnswerRef.current)
        setState(prevState => ({
          ...prevState,
          displayAnswer: false,
          time: 10,
          selectedAnswer: '',
          questionNumber: prevState.questionNumber + 1
        }))
      }, 1000)
    }

    if (state.endGame) {
      setInterval(() => {
        navigation.navigate('EndGame')
      }, 1000)
    }

    return () => {
      clearTimeout(displayAnswerRef.current)
    }
  }, [state.displayAnswer, state.endGame]);

  // Prevent to display question/answer when game is finish
  // if (state.questionNumber + 1 === gameData.length) {
  //   // return navigation.navigate('EndGame')
  // }

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
              <Text style={styles.answerIndex}>{letters[answerNumber]}.</Text> <Text style={styles.answerText}>{answer}</Text>
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
