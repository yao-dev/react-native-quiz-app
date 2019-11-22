import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import { db } from '../../utils/firebase';
import game from '../../utils/game';

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
    width: '100%',
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
    players: [],
  })
  const gameRef = db.ref('/games').child(props.gameId);
  const playersRef = gameRef.child('players');

  const onGameChange = (snapshot) => {
    const game = snapshot.val();
    if (game.started) {
      gameRef.off('value', onGameChange)
      playersRef.off('value', onPlayerChange)
      navigation.navigate('LoadCategory', {
        gameId: props.gameId
      })
    }
  }

  const onPlayerChange = (snapshot) => {
    setState(prevState => ({ ...prevState, players: game.formatPlayers(snapshot.val()) }))
  }

  useEffect(() => {
    gameRef.on('value', onGameChange)
    playersRef.on('value', onPlayerChange)

    return () => {
      gameRef.off('value', onGameChange)
      playersRef.off('value', onPlayerChange)
    }
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
          {state.players && state.players.map((player) => {
            return <Text key={player.id} style={styles.playerUsername}>{player.username}</Text>
          })}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => gameRef.update({ started: true })}
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

  return {
    gameId,
    players: [],
  };
}

export default connect(
  mapStateToProps,
  null
)(WaitPlayer);
