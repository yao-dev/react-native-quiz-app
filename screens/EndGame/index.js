import Constants from 'expo-constants';
import { sortBy } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import { db } from '../../utils/firebase';
import game from '../../utils/game';

const { width, height } = Dimensions.get('window');

const styles = {
  safeAreaView: {
    flex: 1,
    marginTop: Constants.statusBarHeight
  },
  title: {
    marginTop: 50,
    fontSize: 50,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#6c63ff',
  },
  image: {
    marginTop: 25,
    width: width,
    height: 250
  },
  imageContainer: {
    flex: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstButton: {
    marginBottom: 10
  }
}

// [
//   Object {
//     "gameId": "7",
//     "id": "-LuFDhQ6mvzb6rOWFy-M",
//     "owner": true,
//     "points": 30,
//     "username": "wr",
//   },
// ]

const EndGame = ({ navigation, ...props }) => {
  const [players, setPlayers] = useState([])
  const gameRef = db.ref('/games').child(props.game.id)
  const playersRef = gameRef.child('players')

  useEffect(() => {
    playersRef.on('value', (snapshot) => {
      let players = snapshot.val()
      players = sortBy(game.formatPlayers(players), ['points', 'scoreTime']);
      setPlayers(players)
    })
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* TITLE */}
      <Text style={styles.title}>result</Text>
      {/* QUIZ IMAGE */}
      <View style={styles.imageContainer}>
        <Image resizeMode='center' style={styles.image} source={require('../../assets/end-game-trophy.png')} />
      </View>

      <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        {players.map((player, index) => {
          return (
            <View key={player.id} style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text>{index + 1}. {player.username} {player.points}</Text>
                <Text>{player.gameComplete && !index && '🏆'}</Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text>{!player.gameComplete && '⌛️'}</Text>
                <Text>{player.gameComplete && moment(player.scoreTime).format('mm:ss:SSS')}</Text>
              </View>
            </View>
          )
        })}
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>
        <Button
          background='purple'
          color='white'
          onPress={() => navigation.navigate('Home')}
          style={styles.firstButton}
        >
          new game
        </Button>
      </View>
    </SafeAreaView>
  );
}

EndGame.navigationOptions = {
  header: null
}

export default connect(
  state => state
)(EndGame);
