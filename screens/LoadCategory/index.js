import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { db } from '../../utils/firebase';

const LoadCategory = ({ navigation, ...props }) => {
  const [time, setTime] = useState(3);
  const [gameData, setGameData] = useState([]);
  const timerRef = useRef()

  useEffect(() => {
    (async () => {
      const gameId = navigation.state.params.gameId;
      db.ref('/games').child(gameId).once('value', (snapshot) => {
        const game = snapshot.val()
        console.log(game)
        setGameData(game.questions)
      })
    })()
  }, [])

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

export default LoadCategory;
