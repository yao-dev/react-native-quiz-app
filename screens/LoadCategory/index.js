import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import actions from '../../redux/actions/game';
import { db } from '../../utils/firebase';
import game from '../../utils/game';
import { SECOND_BEFORE_GAME_START } from '../constants';

const LoadCategory = ({ navigation, ...props }) => {
  const [time, setTime] = useState(SECOND_BEFORE_GAME_START);
  const [gameData, setGameData] = useState([]);
  const timerRef = useRef()
  const categoryUrl = navigation.state.params.url
  const isSingleMode = navigation.state.params.mode === 'SINGLE_PLAYER'

  const createGame = (async () => {
    await props.createGame(categoryUrl)
  })

  // CREATE GAME "SINGLE_PLAYER"
  useEffect(() => {
    if (isSingleMode) {
      createGame()
    }
  }, [])

  // ADD PLAYER & SET QUESTIONS "SINGLE_PLAYER"
  useEffect(() => {
    if (isSingleMode && props.game.id) {
      props.addPlayer({
        owner: true,
        username: 'test',
        gameId: props.game.id,
      })

      db.ref('/games').child(props.game.id).once('value', (snapshot) => {
        const game = snapshot.val()
        setGameData(game.questions)
      })
    }
  }, [props.game.id])

  // SET QUESTIONS "MULTI_PLAYER"
  useEffect(() => {
    let gameId = navigation.state.params.gameId;

    if (gameId && !isSingleMode) {
      db.ref('/games').child(gameId).once('value', (snapshot) => {
        const game = snapshot.val()
        setGameData(game.questions)
      })
    }
  }, [])

  // TIMER BEFORE GAME START
  useEffect(() => {
    if (!time) {
      clearTimeout(timerRef.current)

      if (gameData.length) {
        navigation.navigate('Game', { gameData })
      } else {
        navigation.navigate('SelectCategory')
      }
    }

    timerRef.current = setTimeout(() => {
      setTime(prevTime => prevTime - 1)
    }, 1000)

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [time])

  return (
    <View
      style={{
        flex: 1,
        flexFlow: 'row wrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6c63ff',
      }}
    >
      <Text
        style={{
          color: '#FFF',
          fontSize: 80,
          fontWeight: 'bold',
        }}
      >
        {time}
      </Text>
    </View>
  )
}

LoadCategory.navigationOptions = {
  header: null
}

const mapDispatchToProps = (dispatch) => {
  return {
    createGame: async (categoryUrl) => {
      const gameId = await game.create(categoryUrl)
      return dispatch(actions.setGameId(gameId))
    },
    addPlayer: async (player) => {
      const { id } = await game.addPlayer(player)
      return dispatch(actions.setPlayerId(id))
    },
  }
}

export default connect(
  state => state,
  mapDispatchToProps
)(LoadCategory);
