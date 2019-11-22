import Constants from 'expo-constants';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import actions from '../../redux/actions/game';
import { db } from '../../utils/firebase';
import game from '../../utils/game';

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
  disabled: {
    opacity: 0.6
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
    <TouchableOpacity {...restProps} style={[buttonStyles.button, style, restProps.disabled && buttonStyles.disabled]}>
      <Text style={buttonStyles.text}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = {
  safeAreaView: {
    flex: 1,
  },
  title: {
    paddingTop: 50 + Constants.statusBarHeight,
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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

  const gameId = get(navigation, 'state.params.gameId')
  const isCreator = get(navigation, 'state.params.creator')
  const categoryUrl = get(navigation, 'state.params.url')

  const submitDisabled = !username.trim().length;

  const joinGame = async () => {
    // JOIN THE GAME
    props.addPlayer({
      username,
      gameId,
    })

    db.ref('/games').child(gameId).once('value', (snapshot) => {
      if (snapshot.val().started) {
        navigation.navigate('LoadCategory', { gameId })
      } else {
        navigation.navigate('WaitPlayer', { gameId })
      }
    })
  }

  // GO TO INVITE PLAYER
  useEffect(() => {
    if (isCreator && props.game.id) {
      props.addPlayer({
        owner: true,
        username,
        gameId: props.game.id,
      })

      navigation.navigate('InvitePlayer', {
        id: props.game.id,
        url: categoryUrl,
      })
    }
  }, [props.game.id])

  const onSubmit = async () => {
    if (submitDisabled) return;

    if (isCreator) {
      await props.createGame(categoryUrl)
    } else {
      await joinGame()
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          {/* TITLE */}
          <Text style={styles.title}>create player</Text>
          {/* QUIZ IMAGE */}
          <View style={styles.imageContainer}>
            <Image resizeMode='contain' style={styles.image} source={require('../../assets/new-player.png')} />
          </View>
          {/* INPUT & BUTTON */}
          <View style={styles.buttonContainer}>
            <TextInput
              placeholder='USERNAME'
              style={styles.input}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={setUsername}
              onSubmitEditing={onSubmit}
            />
            <Button
              onPress={onSubmit}
              disabled={submitDisabled}
            >
              save
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

NewPlayer.navigationOptions = {
  header: null
}

const mapDispatchToProps = (dispatch) => {
  return {
    createGame: async (categoryUrl) => {
      const gameId = await game.create(categoryUrl)
      return dispatch(actions.setGameId(gameId))
    },
    addPlayer: async (player) => {
      const { id } = await game.addPlayer(player)
      return dispatch(actions.setPlayerId(id))
    },
    gamePlayersUpdate: (gameUpdated) => dispatch(actions.gamePlayersUpdate(gameUpdated))
  }
}

export default connect(
  state => state,
  mapDispatchToProps
)(NewPlayer);
