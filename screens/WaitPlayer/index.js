import Constants from 'expo-constants';
import React, { useEffect } from 'react';
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
  // Listen new player
  useEffect(() => {
    io.on('join', player => console.log(player))
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text style={styles.title}>quiz</Text>
    </SafeAreaView>
  );
}

WaitPlayer.navigationOptions = {
  header: null
}

export default WaitPlayer;
