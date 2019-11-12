import { Linking } from 'expo';
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

const Splash = ({ navigation, ...props }) => {
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        const { path } = Linking.parse(url);
        const [,route] = path ? path.split('//') : [, '/']

        if (route && route.includes('game/')) {
          const [, gameId] = route.split('/')
          navigation.navigate('NewPlayer', { gameId })
        } else {
          navigation.navigate('Home')
        }
      }
    }).catch(err => console.error('An error occurred', err));
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
