import Constants from 'expo-constants';
import { get } from 'lodash';
import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    borderRadius: 50
  },
  text: {
    textTransform: 'capitalize',
    color: '#FFF',
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
    marginTop: Constants.statusBarHeight
  },
  title: {
    marginTop: 50,
    fontSize: 40,
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
  input: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    maxWidth: '80%',
    padding: 10,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#6c63ff',
    color: '#6c63ff',
    backgroundColor: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  buttonContainer: {
    flex: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

const NewPlayer = ({ navigation, ...props }) => {
  const [username, setUsername] = useState('')

  const joinGame = () => {
    const newGameId = Math.random().toString(36).substr(2).toUpperCase();

    if (get(navigation, 'state.params.creator')) {
      io.emit('newGame', {
        id: newGameId,
        url: get(navigation, 'state.params.url'),
      })

      io.emit('join', {
        username,
        gameId: newGameId,
      })

      return navigation.navigate('InvitePlayer', {
        id: newGameId,
        url: get(navigation, 'state.params.url'),
      })
    }

    io.emit('join', {
      username,
      gameId: newGameId,
    })

    return navigation.navigate('WaitPlayer')
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* TITLE */}
      <Text style={styles.title}>create player</Text>
      {/* QUIZ IMAGE */}
      <View style={styles.imageContainer}>
        <Image resizeMode='contain' style={styles.image} source={require('../../assets/new-player.png')} />
      </View>
      {/* INPUT & BUTTON */}
      <View style={styles.buttonContainer}>
        <TextInput
          placeholder='Type your username'
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <Button onPress={joinGame}>
          save
        </Button>
      </View>
    </SafeAreaView>
  );
}

NewPlayer.navigationOptions = {
  header: null
}

export default NewPlayer;
