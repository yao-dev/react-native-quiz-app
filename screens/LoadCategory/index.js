import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const buttonStyles = {
  button: {
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6c63ff',
    width: '80%',
    maxWidth: '80%',
    paddingVertical: 10,
    borderRadius: 50,
    elevation: 5,
  },
  text: {
    textTransform: 'capitalize',
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
}

const Button = ({ style = {}, children, ...restProps }) => {
  return (
    <TouchableOpacity {...restProps} style={[buttonStyles.button, style]}>
      {typeof children !== 'string' ? children : (
        <Text style={buttonStyles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = {
  title: {
    marginTop: 50,
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#6c63ff',
  },
}

const fetchData = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data.results || []
  } catch (e){
    console.log(e)
    return []
  }
}

const LoadCategory = ({ navigation, ...props }) => {
  const [time, setTime] = useState(3);
  const [gameData, setGameData] = useState([]);
  const timerRef = useRef()

  useEffect(() => {
    (async () => {
      const result = await fetchData(navigation.state.params.url)
      setGameData(result)
    })()
  }, [])

  useEffect(() => {
    if (!time) {
      clearTimeout(timerRef.current)
      navigation.navigate('Game', { gameData })
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