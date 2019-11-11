import { Linking } from 'expo';
import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import io from 'socket.io-client';

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

const Splash = ({ navigation, ...props }) => {
  // Connect to socket
  useEffect(() => {
    // http://f27bd88d.ngrok.io -> http://localhost:3000
    const socket = io('http://f28f7f4f.ngrok.io');

    socket.connect();
    socket.on('connect', () => {
      console.log('connected to socket server');
      Linking.getInitialURL().then((url) => {
        if (url) {
          const { path } = Linking.parse(url);
          const [,route] = path ? path.split('//') : [, '/']

          if (route.includes('game/')) {
            const [, gameId] = route.split('/')
            navigation.navigate('NewPlayer', { gameId })
          } else {
            navigation.navigate('Home')
          }
        }
      }).catch(err => console.error('An error occurred', err));
    });
    global.io = socket;
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text style={styles.title}>quiz</Text>
    </SafeAreaView>
  );
}

Splash.navigationOptions = {
  header: null
}

export default Splash;
