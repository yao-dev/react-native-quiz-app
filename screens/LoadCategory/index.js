import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

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

const fetchData = async (url) => {
  try {
    const { data } = await axios.get(url);
    let results = []

    if (data.results) {
      results = data.results.map((result) => {
        result.answers = [result.correct_answer].concat(result.incorrect_answers);
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
