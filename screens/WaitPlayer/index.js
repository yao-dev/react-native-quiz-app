import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';

const styles = {
  safeAreaView: {
    flex: 1,
    backgroundColor: '#6c63ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -Constants.statusBarHeight,
  },
  title: {
    marginTop: 50,
    fontSize: 50,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#FFF',
  },
}

const WaitPlayer = ({ navigation, ...props }) => {
  const [players, setPlayers] = useState([])
  // Listen new player
  useEffect(() => {
    io.on('join', (player) => {
      setPlayers(players => players.push(player))
    })
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text style={styles.title}>quiz</Text>
      {players.map((player) => {
        return <Text key={player.id} style={styles.title}>{player.username}</Text>
      })}
    </SafeAreaView>
  );
}

WaitPlayer.navigationOptions = {
  header: null
}

export default WaitPlayer;
