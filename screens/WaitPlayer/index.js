import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { db } from '../../utils/firebase';

const buttonStyles = {
  button: {
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '80%',
    maxWidth: '80%',
    paddingVertical: 10,
    borderRadius: 50
  },
  text: {
    textTransform: 'capitalize',
    color: '#6c63ff',
    fontSize: 25,
    fontWeight: 'bold',
  }
}

const Button = ({ style = {}, children, ...restProps }) => {
  return (
    <TouchableOpacity {...restProps} style={[buttonStyles.button, style]}>
      <Text style={buttonStyles.text}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = {
  safeAreaView: {
    flex: 1,
    backgroundColor: '#6c63ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    justifyContent: 'space-between'
  },
  title: {
    marginTop: 50,
    fontSize: 50,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#FFF',
  },
  playerUsername: {
    // marginTop: 50,
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#FFF',
  },
  buttonContainer: {
    flex: 0.3,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  }
}

const WaitPlayer = ({ navigation, ...props }) => {
  const [state, setState] = useState({
    players: props.players,
  })

  useEffect(() => {
    db.ref('/games').child(props.gameId).on('value', (snapshot) => {
      const game = snapshot.val();
      if (game.start) {
        navigation.navigate('LoadCategory', {
          gameId: props.gameId
        })
      }
    })

    db.ref('/games').child(props.gameId).child('players').on('value', (snapshot) => {
      setState(prevState => ({ ...prevState, players: props.getPlayers(snapshot.val()) }))
    })
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* <Text style={styles.title}>Waiting players</Text> */}
      <View style={styles.container}>
        <View
          style={{
            flex: 0.7,
            flexFlow: 'row wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {state.players.map((player) => {
            return <Text key={player.id} style={styles.playerUsername}>{player.username}</Text>
          })}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              db.ref('/games').child(props.gameId).update({
                start: true
              })
            }}
          >
            Start 🎮🕹
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

WaitPlayer.navigationOptions = {
  header: null
}

const mapStateToProps = (state, ownProps) => {
  const gameId = ownProps.navigation.state.params.gameId;
  const currentGame = state.games[gameId] || {};
  const getPlayers = (players) => Object.keys(players).map((playerId) => {
    return {
      id: playerId,
      ...players[playerId]
    }
  })

  if (!Object.keys(currentGame).length) {
    return {
      gameId,
      players: [],
      getPlayers
    }
  }

  const players = getPlayers(currentGame.players)

  return {
    gameId,
    players,
    getPlayers
  };
}

export default connect(
  mapStateToProps,
  null
)(WaitPlayer);
